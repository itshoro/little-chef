import type { Connection } from "@/drizzle/db";
import {
  fileReference,
  recipeLikes,
  recipeUserPermissions,
  recipes,
  users,
} from "@/drizzle/schema";
import type { RecipeLikeRepository } from "@/lib/application/abstractions/recipe/recipe-like-repository";
import type { Recipe } from "@/lib/domain/recipe/recipe";
import type { Collaborator } from "@/lib/domain/shared/collaborator";
import type { FileReference } from "@/lib/domain/shared/file-reference";
import type { Result } from "@/lib/domain/shared/result";
import type { Username } from "@/lib/domain/user/credentials";
import type { User } from "@/lib/domain/user/user";
import { and, eq, inArray, or, sql } from "drizzle-orm";

export class DrizzleRecipeLikeRepository implements RecipeLikeRepository {
  constructor(private readonly db: Connection) {}

  async hasUserLiked(recipe: Recipe, user: User): Promise<Result<boolean>> {
    try {
      const [result] = await this.db
        .select()
        .from(recipeLikes)
        .where(
          and(
            eq(recipeLikes.recipeId, recipe.id),
            eq(recipeLikes.userId, user.id),
          ),
        );

      if (!result) {
        return { ok: true, value: false };
      }

      return { ok: true, value: true };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to check if user liked recipe.", { cause: e }),
      };
    }
  }

  async likeRecipe(recipe: Recipe, user: User): Promise<Result<void>> {
    try {
      await this.db.transaction(async (tx) => {
        const likeResult = await tx
          .insert(recipeLikes)
          .values({ recipeId: recipe.id, userId: user.id })
          .onConflictDoNothing();

        if (likeResult.rowsAffected === 0) {
          throw new Error("User has already liked this recipe.");
        }

        const recipeResult = await tx
          .update(recipes)
          .set({ likes: sql`${recipes.likes} + 1` })
          .where(eq(recipes.id, recipe.id));

        if (recipeResult.rowsAffected === 0) {
          throw new Error("Recipe not found."); // Should be a noop.
        }
      });

      return { ok: true, value: undefined };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to like recipe.", { cause: e }),
      };
    }
  }

  async unlikeRecipe(recipe: Recipe, user: User): Promise<Result<void>> {
    try {
      await this.db.transaction(async (tx) => {
        const deleteResult = await tx
          .delete(recipeLikes)
          .where(
            and(
              eq(recipeLikes.recipeId, recipe.id),
              eq(recipeLikes.userId, user.id),
            ),
          );

        if (deleteResult.rowsAffected === 0) {
          throw new Error("User has not liked this recipe.");
        }

        const recipeResult = await tx
          .update(recipes)
          .set({ likes: sql`${recipes.likes} - 1` })
          .where(eq(recipes.id, recipe.id));

        if (recipeResult.rowsAffected === 0) {
          throw new Error("Recipe not found."); // Should be a noop.
        }
      });

      return { ok: true, value: undefined };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to unlike recipe.", { cause: e }),
      };
    }
  }

  async findByUser(user: User): Promise<Result<Recipe[]>> {
    try {
      const likesResult = await this.db
        .select()
        .from(recipeLikes)
        .innerJoin(recipes, eq(recipeLikes.recipeId, recipes.id))
        .leftJoin(
          recipeUserPermissions,
          eq(recipes.id, recipeUserPermissions.recipeId),
        )
        .where(
          and(
            eq(recipeLikes.userId, user.id),
            or(
              inArray(recipes.visibility, ["public", "unlisted"]),
              eq(recipeUserPermissions.userId, user.id),
            ),
          )
        )
        .orderBy(sql`${recipeLikes.createdAt} DESC`);

      if (likesResult.length === 0) return { ok: true, value: [] };

      const recipeIds = likesResult.map((r) => r.recipes.id);
      const coverIds = likesResult
        .map((r) => r.recipes.coverId)
        .filter((c) => c !== null);

      const [collaboratorsByRecipe, fileReferencesMap] = await Promise.all([
        this.findCollaborators(recipeIds),
        this.findFileReferences(coverIds),
      ]);

      return {
        ok: true,
        value: likesResult.map((r) => ({
          ...r.recipes,
          cover: r.recipes.coverId
            ? (fileReferencesMap.get(r.recipes.coverId) ?? null)
            : null,
          collaborators: collaboratorsByRecipe.get(r.recipes.id) ?? [],
        })),
      };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to find liked recipes.", { cause: e }),
      };
    }
  }

  private async findCollaborators(
    recipeIds: Recipe["id"][],
  ): Promise<Map<Recipe["id"], Collaborator[]>> {
    const collaboratorsResult = await this.db
      .select({
        recipeId: recipeUserPermissions.recipeId,
        role: recipeUserPermissions.role,
        user: users,
        userAvatar: fileReference,
      })
      .from(recipeUserPermissions)
      .innerJoin(users, eq(recipeUserPermissions.userId, users.id))
      .leftJoin(fileReference, eq(fileReference.id, users.avatarId))
      .where(
        and(
          inArray(recipeUserPermissions.recipeId, recipeIds),
          inArray(recipeUserPermissions.role, [
            "owner",
            "editor",
            "maintainer",
          ]),
        ),
      );

    const collaboratorsByRecipe = new Map<Recipe["id"], Collaborator[]>();
    for (const c of collaboratorsResult) {
      const arr = collaboratorsByRecipe.get(c.recipeId) ?? [];
      arr.push({
        role: c.role,
        user: {
          ...c.user,
          username: c.user.username as Username,
          avatar: c.userAvatar,
        },
      });
      collaboratorsByRecipe.set(c.recipeId, arr);
    }

    return collaboratorsByRecipe;
  }

  private async findFileReferences(
    fileReferenceIds: FileReference["id"][],
  ): Promise<Map<FileReference["id"], FileReference>> {
    const fileReferencesMap = new Map<FileReference["id"], FileReference>();
    if (fileReferenceIds.length > 0) {
      const fileReferences = await this.db
        .select()
        .from(fileReference)
        .where(inArray(fileReference.id, fileReferenceIds));
      for (const f of fileReferences) fileReferencesMap.set(f.id, f);
    }

    return fileReferencesMap;
  }
}
