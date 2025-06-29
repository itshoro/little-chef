import "server-only";

import { db, type Connection, type Transaction } from "@/drizzle/db";
import {
  collectionRecipes,
  collections,
  collectionUserPermissions,
  recipes,
  recipeUserPermissions,
  users,
  type CollectionIdentifier,
  type DrizzleCollection,
  type DrizzleCollectionInsert,
  type DrizzleCollectionUserPermission,
  type DrizzleCollectionUserPermissionInsert,
  type DrizzleRecipe,
  type DrizzleUser,
  type IdentifiedById,
} from "@/drizzle/schema";
import type { AuthenticatedUser } from "@/lib/services/auth/types";
import { and, eq, exists, inArray, or, sql } from "drizzle-orm";
import { CollectionNotFoundError } from "../../errors/resource-not-found/collection";
import { withCollectionQueryOptions, type ListQueryOptions } from "../utils";

export async function unsafeCreateCollection(
  connection: Connection,
  dto: DrizzleCollectionInsert,
) {
  const [collection] = await connection
    .insert(collections)
    .values(dto)
    .returning();

  return collection;
}

export async function unsafeGetCollectionByIdentifier(
  collectionIdentifier: CollectionIdentifier,
) {
  const [collection] = await db
    .select()
    .from(collections)
    .where(
      and(
        "id" in collectionIdentifier
          ? eq(collections.id, collectionIdentifier.id)
          : eq(collections.publicId, collectionIdentifier.publicId),
      ),
    );

  return collection ?? null;
}

export async function unsafeUpdateCollection(
  connection: Connection,
  identifier: IdentifiedById<DrizzleCollection>,
  dto: DrizzleCollectionInsert,
) {
  return await connection
    .update(collections)
    .set(dto)
    .where(eq(collections.id, identifier.id))
    .returning();
}

export async function unsafeDeleteCollection(
  tx: Transaction,
  collectionIdentifier: IdentifiedById<DrizzleCollection>,
) {
  return await tx
    .delete(collections)
    .where(eq(collections.id, collectionIdentifier.id));
}

// MARK: User Permissions

export async function unsafeCreateUserPermissionsForCollection(
  connection: Connection,
  dto: DrizzleCollectionUserPermissionInsert,
) {
  return await connection.insert(collectionUserPermissions).values(dto);
}

export async function unsafeDeleteCollectionUserPermissions(
  connection: Connection,
  collectionIdentifier: IdentifiedById<DrizzleCollection>,
  user: IdentifiedById<DrizzleUser>,
) {
  return await connection
    .delete(collectionUserPermissions)
    .where(
      and(
        eq(collectionUserPermissions.collectionId, collectionIdentifier.id),
        eq(collectionUserPermissions.userId, user.id),
      ),
    );
}

// MARK: Collection Recipes

export async function unsafeGetRecipesForCollection(
  collectionIdentifier: IdentifiedById<DrizzleCollection>,
  user: IdentifiedById<DrizzleUser> | null,
) {
  // todo: unsafeGetRecipes must hide recipes that the requesting user shouldn't be able to see.

  const recipeIdsInCollection = db
    .select({ recipeId: collectionRecipes.recipeId })
    .from(collectionRecipes)
    .where(
      and(
        eq(collectionRecipes.collectionId, collectionIdentifier.id),
        eq(collectionRecipes.recipeId, recipes.id),
      ),
    );

  const accessConditions = [
    inArray(recipes.visibility, ["public", "unlisted"]),
  ];

  if (user) {
    const userHasRecipePermissions = db
      .select()
      .from(recipeUserPermissions)
      .where(
        and(
          eq(recipeUserPermissions.recipeId, recipes.id),
          eq(recipeUserPermissions.userId, user.id),
        ),
      );

    accessConditions.push(exists(userHasRecipePermissions));
  }

  return await db
    .select()
    .from(recipes)
    .where(and(exists(recipeIdsInCollection), or(...accessConditions)));
}

export async function unsafeAddRecipe(
  connection: Connection,
  collection: IdentifiedById<DrizzleCollection>,
  recipe: IdentifiedById<DrizzleRecipe>,
) {
  return await connection.insert(collectionRecipes).values({
    recipeId: recipe.id,
    collectionId: collection.id,
  });
}

export async function unsafeRemoveRecipe(
  connection: Connection,
  collectionIdentifier: IdentifiedById<DrizzleCollection>,
  recipeIdentifier: IdentifiedById<DrizzleRecipe>,
) {
  await connection
    .delete(collectionRecipes)
    .where(
      and(
        eq(collectionRecipes.recipeId, recipeIdentifier.id),
        eq(collectionRecipes.collectionId, collectionIdentifier.id),
      ),
    );
}

// MARK: Misc

export async function unsafeFindCollectionIdsWithRecipe(
  identifier: IdentifiedById<DrizzleRecipe>,
) {
  return await db
    .selectDistinct({ id: collectionRecipes.collectionId })
    .from(collectionRecipes)
    .where(eq(collectionRecipes.recipeId, identifier.id))
    .groupBy(collectionRecipes.collectionId);
}

export async function unsafeUpdateCollectionRecipeItemCount(
  tx: Transaction,
  identifier: IdentifiedById<DrizzleCollection>,
) {
  return await tx
    .update(collections)
    .set({
      itemCount: sql<number>`(
              SELECT CAST(COUNT(${collectionRecipes.recipeId}) AS INT)
              FROM ${collectionRecipes}
              WHERE ${eq(collectionRecipes.collectionId, identifier.id)}
            )`,
    })
    .where(eq(collections.id, identifier.id))
    .returning();
}

export async function unsafeFindEditableCollections(
  userIdentifier: IdentifiedById<DrizzleUser>,
  options: ListQueryOptions,
) {
  const query = db
    .selectDistinct({ collection: collections })
    .from(collectionUserPermissions)
    .innerJoin(
      collections,
      eq(collections.id, collectionUserPermissions.collectionId),
    );

  let queryBuilder = query.$dynamic();

  queryBuilder = queryBuilder.where(
    and(
      eq(collectionUserPermissions.userId, userIdentifier.id),
      inArray(collectionUserPermissions.role, [
        "owner",
        "maintainer",
        "editor",
      ]),
    ),
  );
  queryBuilder = withCollectionQueryOptions(queryBuilder, options);

  const result = await queryBuilder;
  return result.map((item) => item.collection);
}

export async function unsafeGetCollections(
  user: AuthenticatedUser | null,
  options: ListQueryOptions,
) {
  const conditions = [eq(collections.visibility, "public")];
  if (user) {
    const subscribedCollectionIdsSubquery = db
      .select({ collectionId: collectionUserPermissions.collectionId })
      .from(collectionUserPermissions)
      .where(eq(collectionUserPermissions.userId, user.id));

    conditions.push(inArray(collections.id, subscribedCollectionIdsSubquery));
  }

  let queryBuilder = db.select().from(collections).$dynamic();
  queryBuilder = queryBuilder.where(or(...conditions));
  queryBuilder = withCollectionQueryOptions(queryBuilder, options);
  return await queryBuilder;
}

export async function unsafeGetMaintainersForCollection(
  collectionId: CollectionIdentifier,
) {
  return await unsafeGetAllUserPermissionsByRolesForCollection(collectionId, [
    "editor",
    "maintainer",
    "owner",
  ]);
}

export async function unsafeGetMaintainersForCollections(
  collectionIds: IdentifiedById<DrizzleCollection>["id"][],
) {
  if (collectionIds.length === 0) return [];

  return await db
    .select({
      collectionId: collectionUserPermissions.collectionId,
      maintainer: users,
      role: collectionUserPermissions.role,
    })
    .from(collectionUserPermissions)
    .where(
      and(
        inArray(collectionUserPermissions.collectionId, collectionIds),
        inArray(collectionUserPermissions.role, [
          "editor",
          "maintainer",
          "owner",
        ]),
      ),
    )
    .innerJoin(users, eq(collectionUserPermissions.userId, users.id));
}

export async function unsafeGetAllUserPermissionsByRolesForCollection(
  collectionIdentifier: CollectionIdentifier,
  roles: DrizzleCollectionUserPermission["role"][],
) {
  const collectionId = await unsafeResolveCollectionId(collectionIdentifier);

  return await db
    .select({
      maintainer: users,
      role: collectionUserPermissions.role,
    })
    .from(collectionUserPermissions)
    .where(
      and(
        eq(collectionUserPermissions.collectionId, collectionId),
        inArray(collectionUserPermissions.role, roles),
      ),
    )
    .innerJoin(users, eq(collectionUserPermissions.userId, users.id));
}

export async function unsafeGetUserPermissionsForCollection(
  identifier: CollectionIdentifier,
  user: AuthenticatedUser,
) {
  const collectionId = await unsafeResolveCollectionId(identifier);

  const [result] = await db
    .select()
    .from(collectionUserPermissions)
    .where(
      and(
        eq(collectionUserPermissions.userId, user.id),
        eq(collectionUserPermissions.collectionId, collectionId),
      ),
    );

  return result ?? null;
}

export async function unsafeResolveCollectionId(
  identifier: CollectionIdentifier,
) {
  if ("id" in identifier) return identifier.id;

  const [result] = await db
    .select({ id: collections.id })
    .from(collections)
    .where(eq(collections.publicId, identifier.publicId));

  if (!result) throw new CollectionNotFoundError(identifier);
  return result.id;
}
