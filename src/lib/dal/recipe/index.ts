import "server-only";

import { db, type Connection } from "@/drizzle/db";
import {
  recipeLikes,
  recipes,
  recipeSteps,
  recipeUserPermissions,
  users,
  type DrizzleRecipe,
  type DrizzleRecipeInsert,
  type DrizzleRecipeStepsInsert,
  type DrizzleRecipeUserPermissionInsert,
  type DrizzleUser,
  type IdentifiedById,
  type RecipeIdentifier,
} from "@/drizzle/schema";
import { and, eq, inArray, or } from "drizzle-orm";
import { RecipeNotFoundError } from "../../errors/resource-not-found/recipe";
import type { AuthenticatedUser } from "../../services/auth";
import { withRecipeQueryOptions, type ListQueryOptions } from "../utils";

// MARK: Recipes

export async function unsafeCreateRecipe(
  connection: Connection,
  dto: DrizzleRecipeInsert,
) {
  const [recipe] = await connection.insert(recipes).values(dto).returning();

  return recipe ?? null;
}

export async function unsafeFindRecipes(
  user: AuthenticatedUser | null,
  options: ListQueryOptions,
) {
  const conditions = [eq(recipes.visibility, "public")];
  if (user) {
    const subscribedRecipeIdsSubquery = db
      .select({ recipeId: recipeUserPermissions.recipeId })
      .from(recipeUserPermissions)
      .where(eq(recipeUserPermissions.userId, user.id));

    conditions.push(inArray(recipes.id, subscribedRecipeIdsSubquery));
  }

  let queryBuilder = db.select().from(recipes).$dynamic();
  queryBuilder = queryBuilder.where(or(...conditions));
  queryBuilder = withRecipeQueryOptions(queryBuilder, options);
  return await queryBuilder;
}

export async function unsafeUpdateRecipe(
  connection: Connection,
  identifier: IdentifiedById<DrizzleRecipe>,
  dto: DrizzleRecipeInsert,
) {
  return await connection
    .update(recipes)
    .set(dto)
    .where(eq(recipes.id, identifier.id))
    .returning();
}

export async function unsafeGetRecipeByIdentifier(
  identifier: RecipeIdentifier,
) {
  const [recipe] = await db
    .select()
    .from(recipes)
    .where(
      "id" in identifier
        ? eq(recipes.id, identifier.id)
        : eq(recipes.publicId, identifier.publicId),
    );

  return recipe ?? null;
}

export async function unsafeDeleteRecipe(
  connection: Connection,
  identifier: IdentifiedById<DrizzleRecipe>,
) {
  return await connection.delete(recipes).where(eq(recipes.id, identifier.id));
}

// MARK: Recipe User Permissions

export async function unsafeCreateUserPermissionForRecipe(
  connection: Connection,
  dto: DrizzleRecipeUserPermissionInsert,
) {
  return await connection.insert(recipeUserPermissions).values(dto);
}

export async function unsafeGetUserPermissionForRecipe(
  identifier: RecipeIdentifier,
  user: AuthenticatedUser,
) {
  const recipeId = await unsafeResolveRecipeId(identifier);

  return await db
    .select()
    .from(recipeUserPermissions)
    .where(
      and(
        eq(recipeUserPermissions.recipeId, recipeId),
        eq(recipeUserPermissions.userId, user.id),
      ),
    );
}

export async function unsafeGetMaintainersForRecipe(
  recipeIdentifier: RecipeIdentifier,
) {
  const recipeId = await unsafeResolveRecipeId(recipeIdentifier);

  return await db
    .select({
      maintainer: users,
      role: recipeUserPermissions.role,
    })
    .from(recipeUserPermissions)
    .where(
      and(
        eq(recipeUserPermissions.recipeId, recipeId),
        inArray(recipeUserPermissions.role, ["editor", "maintainer", "owner"]),
      ),
    )
    .innerJoin(users, eq(users.id, recipeUserPermissions.userId));
}

export async function unsafeFindEditableRecipes(
  userIdentifier: IdentifiedById<DrizzleUser>,
  options: ListQueryOptions,
) {
  const query = db
    .selectDistinct({ recipe: recipes })
    .from(recipeUserPermissions)
    .innerJoin(recipes, eq(recipes.id, recipeUserPermissions.recipeId));

  let queryBuilder = query.$dynamic();

  queryBuilder = queryBuilder.where(
    eq(recipeUserPermissions.userId, userIdentifier.id),
  );
  queryBuilder = withRecipeQueryOptions(queryBuilder, options);

  const result = await queryBuilder;
  return result.map((item) => item.recipe);
}

export async function unsafeGetMaintainersForRecipes(
  recipeIdentifiers: RecipeIdentifier[],
) {
  const recipeIds = await Promise.all(
    recipeIdentifiers.map(unsafeResolveRecipeId),
  );

  return await db
    .select({
      recipeId: recipeUserPermissions.recipeId,
      maintainer: users,
      role: recipeUserPermissions.role,
    })
    .from(recipeUserPermissions)
    .where(
      and(
        inArray(recipeUserPermissions.recipeId, recipeIds),
        inArray(recipeUserPermissions.role, ["editor", "maintainer", "owner"]),
      ),
    )
    .innerJoin(users, eq(users.id, recipeUserPermissions.userId));
}

// MARK: Recipe Steps

export async function unsafeCreateRecipeSteps(
  connection: Connection,
  steps: DrizzleRecipeStepsInsert[],
) {
  return await connection.insert(recipeSteps).values(steps);
}

export async function unsafeGetRecipeSteps(
  recipeIdentifier: IdentifiedById<DrizzleRecipe>,
) {
  return await db
    .select()
    .from(recipeSteps)
    .where(eq(recipeSteps.recipeId, recipeIdentifier.id))
    .orderBy(recipeSteps.order);
}

export async function unsafeDeleteRecipeSteps(
  connection: Connection,
  recipeIdentifier: IdentifiedById<DrizzleRecipe>,
) {
  return await connection
    .delete(recipeSteps)
    .where(eq(recipeSteps.recipeId, recipeIdentifier.id));
}

export async function unsafeResolveRecipeId(
  identifier: RecipeIdentifier,
): Promise<DrizzleRecipe["id"]> {
  if ("id" in identifier) return identifier.id;

  const [result] = await db
    .select({ id: recipes.id })
    .from(recipes)
    .where(eq(recipes.publicId, identifier.publicId));

  if (!result) throw new RecipeNotFoundError(identifier);
  return result.id;
}

// MARK: Recipe Likes

export async function unsafeAddRecipeLike(
  connection: Connection,
  recipeIdentifier: IdentifiedById<DrizzleRecipe>,
  userIdentifier: IdentifiedById<DrizzleUser>,
) {
  return await connection
    .insert(recipeLikes)
    .values({ userId: userIdentifier.id, recipeId: recipeIdentifier.id });
}

export async function unsafeRemoveRecipeLike(
  connection: Connection,
  recipeIdentifier: IdentifiedById<DrizzleRecipe>,
  userIdentifier: IdentifiedById<DrizzleUser>,
) {
  return await connection
    .delete(recipeLikes)
    .where(
      and(
        eq(recipeLikes.userId, userIdentifier.id),
        eq(recipeLikes.recipeId, recipeIdentifier.id),
      ),
    );
}

export async function unsafeIsRecipeLiked(
  recipeIdentifier: IdentifiedById<DrizzleRecipe>,
  userIdentifier: IdentifiedById<DrizzleUser>,
) {
  const recipeId = await unsafeResolveRecipeId(recipeIdentifier);
  const [like] = await db
    .select()
    .from(recipeLikes)
    .where(
      and(
        eq(recipeLikes.userId, userIdentifier.id),
        eq(recipeLikes.recipeId, recipeId),
      ),
    );

  return !!like;
}
