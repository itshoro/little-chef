import type { CollectionRecipeRepository } from "@/lib/application/abstractions/collection/collection-recipe-repository";
import type { Collection } from "@/lib/domain/collection/collection";
import type { Recipe } from "@/lib/domain/recipe/recipe";
import type { Collaborator } from "@/lib/domain/shared/collaborator";
import type { Result } from "@/lib/domain/shared/result";
import type { Username } from "@/lib/domain/user/credentials";
import type { User } from "@/lib/domain/user/user";
import type { Connection } from "@/drizzle/db";
import {
  collectionRecipes,
  collections,
  fileReference,
  recipes,
  recipeUserPermissions,
  users,
} from "@/drizzle/schema";
import { and, eq, inArray, sql } from "drizzle-orm";

export class DrizzleCollectionRecipeRepository
  implements CollectionRecipeRepository
{
  constructor(private readonly db: Connection) {}

  async addRecipeToCollection(
    collection: Collection,
    recipe: Recipe,
  ): Promise<Result<void, Error>> {
    await this.db
      .insert(collectionRecipes)
      .values({ collectionId: collection.id, recipeId: recipe.id });
    await this.db
      .update(collections)
      .set({ itemCount: sql`${collections.itemCount} + 1` })
      .where(eq(collections.id, collection.id));

    return { ok: true, value: undefined };
  }

  async removeRecipeFromCollection(
    collection: Collection,
    recipe: Recipe,
  ): Promise<Result<void, Error>> {
    await this.db
      .delete(collectionRecipes)
      .where(
        and(
          eq(collectionRecipes.collectionId, collection.id),
          eq(collectionRecipes.recipeId, recipe.id),
        ),
      );
    await this.db
      .update(collections)
      .set({ itemCount: sql`${collections.itemCount} - 1` })
      .where(eq(collections.id, collection.id));

    return { ok: true, value: undefined };
  }

  async findRecipesForCollection(
    collection: Collection,
  ): Promise<Result<Recipe[], Error>> {
    const rows = await this.db
      .select()
      .from(collectionRecipes)
      .where(eq(collectionRecipes.collectionId, collection.id))
      .innerJoin(recipes, eq(recipes.id, collectionRecipes.recipeId))
      .innerJoin(fileReference, eq(fileReference.id, recipes.coverId));

    const collaboratorMap = await this.findCollaborators(
      rows.map((r) => r.recipes.id),
    );

    const _recipes = rows.map(
      ({ recipes: recipeRow, file_references: file }) =>
        ({
          id: recipeRow.id,
          publicId: recipeRow.publicId,
          name: recipeRow.name,
          description: recipeRow.description,
          cover: {
            id: file.id,
            url: file.url,
            mimeType: file.mimeType,
            byteSize: file.byteSize,
            createdAt: file.createdAt,
            publicId: file.publicId,
          },
          slug: recipeRow.slug,
          cookingTime: recipeRow.cookingTime,
          likes: recipeRow.likes,
          preparationTime: recipeRow.preparationTime,
          recommendedServingSize: recipeRow.recommendedServingSize,
          visibility: recipeRow.visibility,
          collaborators: collaboratorMap.get(recipeRow.id) ?? [],
        }) satisfies Recipe,
    );

    return { ok: true, value: _recipes };
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
}
