import type { Connection } from "@/drizzle/db";
import {
  fileReference,
  recipeHistories,
  recipeUserPermissions,
  recipes,
  users,
} from "@/drizzle/schema";
import type { HistoryListOptions } from "@/lib/application/abstractions/user/history-repository";
import type { ResourceHistoryRepository } from "@/lib/application/abstractions/user/history-repository";
import type { Recipe } from "@/lib/domain/recipe/recipe";
import type { Collaborator } from "@/lib/domain/shared/collaborator";
import type { FileReference } from "@/lib/domain/shared/file-reference";
import type { Result } from "@/lib/domain/shared/result";
import type { Username } from "@/lib/domain/user/credentials";
import type { User } from "@/lib/domain/user/user";
import { and, eq, inArray, like, or, sql } from "drizzle-orm";

export class DrizzleRecipeHistoryRepository implements ResourceHistoryRepository<Recipe> {
  constructor(private readonly db: Connection) {}

  async upsertRecord(recipe: Recipe, user: User): Promise<Result<void>> {
    try {
      await this.db
        .insert(recipeHistories)
        .values({
          recipeId: recipe.id,
          userId: user.id,
        })
        .onConflictDoUpdate({
          set: {
            createdAt: sql`(unixepoch())`,
          },
          target: [recipeHistories.recipeId, recipeHistories.userId],
        });

      return { ok: true, value: undefined };
    } catch (error) {
      return {
        ok: false,
        error: new Error("Unable to upsert record", { cause: error }),
      };
    }
  }

  async findByUser(
    user: User,
    options?: HistoryListOptions,
  ): Promise<Result<Recipe[]>> {
    try {
      const whereConditions: any[] = [
        eq(recipeHistories.userId, user.id),
        or(
          inArray(recipes.visibility, ["public", "unlisted"]),
          eq(recipeUserPermissions.userId, user.id),
        ),
      ];

      if (options?.search?.query) {
        const q = `%${options.search.query}%`;
        whereConditions.push(
          or(like(recipes.name, q), like(recipes.description, q)),
        );
      }

      const historyResult = await this.db
        .select()
        .from(recipeHistories)
        .innerJoin(recipes, eq(recipeHistories.recipeId, recipes.id))
        .leftJoin(
          recipeUserPermissions,
          eq(recipes.id, recipeUserPermissions.recipeId),
        )
        .where(and(...whereConditions))
        .orderBy(sql`${recipeHistories.createdAt} DESC`);

      if (historyResult.length === 0) return { ok: true, value: [] };

      const recipeIds = historyResult.map((r) => r.recipes.id);
      const coverIds = historyResult
        .map((r) => r.recipes.coverId)
        .filter((c) => c !== null);

      const [collaboratorsByRecipe, fileReferencesMap] = await Promise.all([
        this.findCollaborators(recipeIds),
        this.findFileReferences(coverIds),
      ]);

      return {
        ok: true,
        value: historyResult.map((r) => ({
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
        error: new Error("Failed to find history recipes.", { cause: e }),
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
