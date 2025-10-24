import type {
  CollectionListOptions,
  CollectionReadRepository,
} from "@/lib/application/abstractions/collection/collection-read-repository";
import type {
  Collection,
  CollectionDetail,
} from "@/lib/domain/collection/collection";
import type { Recipe } from "@/lib/domain/recipe/recipe";
import type { Collaborator } from "@/lib/domain/shared/collaborator";
import type { Username } from "@/lib/domain/user/credentials";
import type { User } from "@/lib/domain/user/user";
import type { Connection } from "@/drizzle/db";
import {
  collectionRecipes,
  collections,
  collectionUserPermissions,
  fileReference,
  recipes,
  recipeUserPermissions,
  users,
} from "@/drizzle/schema";
import { and, eq, inArray, like, or } from "drizzle-orm";

export class DrizzleCollectionReadRepository
  implements CollectionReadRepository
{
  constructor(private readonly db: Connection) {}

  async list(
    options: CollectionListOptions,
    user?: User | null,
  ): Promise<Collection[]> {
    options.pagination ??= { page: 1, pageSize: 20 };

    const whereConditions = [
      or(inArray(collections.visibility, ["public", "unlisted"])),
      user?.id ? eq(collectionUserPermissions.userId, user.id) : undefined,
    ];

    if (options.search?.query) {
      const q = `%${options.search.query}%`;
      whereConditions.push(like(collections.name, q));
    }

    const collectionsResult = await this.db
      .selectDistinct()
      .from(collections)
      .leftJoin(
        collectionUserPermissions,
        eq(collections.id, collectionUserPermissions.collectionId),
      )
      .where(or(...whereConditions))
      .offset((options.pagination.page - 1) * options.pagination.pageSize)
      .limit(options.pagination.pageSize);

    if (collectionsResult.length === 0) return [];

    const collectionIds = collectionsResult.map((r) => r.collections.id);
    const collaboratorsByCollection =
      await this.findCollaborators(collectionIds);

    return collectionsResult.map((r) => ({
      ...r.collections,
      collaborators: collaboratorsByCollection.get(r.collections.id) ?? [],
    }));
  }

  async findDetailByIdentifier(
    identifier: { id: Collection["id"] } | { publicId: Collection["publicId"] },
    user?: User | null,
  ): Promise<CollectionDetail | null> {
    const [result] = await this.db
      .select()
      .from(collections)
      .leftJoin(
        collectionUserPermissions,
        eq(collectionUserPermissions.collectionId, collections.id),
      )
      .where(
        and(
          "id" in identifier
            ? eq(collections.id, identifier.id)
            : eq(collections.publicId, identifier.publicId),
          or(
            inArray(collections.visibility, ["public", "unlisted"]),
            user?.id
              ? eq(collectionUserPermissions.userId, user.id)
              : undefined,
          ),
        ),
      );

    if (!result) return null;

    const [collaborators, recipes] = await Promise.all([
      this.findCollaborators([result.collections.id]),
      this.findRecipes(result.collections.id),
    ]);

    return {
      ...result.collections,
      collaborators: collaborators.get(result.collections.id) ?? [],
      recipes: recipes,
    };
  }

  private async findCollaborators(
    collectionIds: Collection["id"][],
  ): Promise<Map<Collection["id"], Collaborator[]>> {
    const collaboratorsResult = await this.db
      .select({
        collectionId: collectionUserPermissions.collectionId,
        role: collectionUserPermissions.role,
        user: users,
        userAvatar: fileReference,
      })
      .from(collectionUserPermissions)
      .innerJoin(users, eq(collectionUserPermissions.userId, users.id))
      .leftJoin(fileReference, eq(fileReference.id, users.avatarId))
      .where(
        and(
          inArray(collectionUserPermissions.collectionId, collectionIds),
          inArray(collectionUserPermissions.role, [
            "owner",
            "editor",
            "viewer",
          ]),
        ),
      );

    const collaboratorsByCollection = new Map<
      Collection["id"],
      Collaborator[]
    >();

    for (const row of collaboratorsResult) {
      const arr = collaboratorsByCollection.get(row.collectionId) ?? [];
      arr.push({
        role: row.role,
        user: {
          ...row.user,
          username: row.user.username as Username,
          avatar: row.userAvatar,
        },
      });

      collaboratorsByCollection.set(row.collectionId, arr);
    }

    return collaboratorsByCollection;
  }

  private async findRecipes(collectionId: Collection["id"]) {
    const recipesResult = await this.db
      .select()
      .from(collectionRecipes)
      .innerJoin(recipes, eq(collectionRecipes.recipeId, recipes.id))
      .leftJoin(fileReference, eq(recipes.coverId, fileReference.id))
      .where(eq(collectionRecipes.collectionId, collectionId));

    const recipeIds = recipesResult.map((r) => r.recipes.id);
    const collaboratorsByRecipe = await this.findRecipeCollaborators(recipeIds);

    return recipesResult.map((r) => ({
      ...r.recipes,
      cover: r.file_references ?? null,
      collaborators: collaboratorsByRecipe.get(r.recipes.id) ?? [],
    }));
  }

  private async findRecipeCollaborators(
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
