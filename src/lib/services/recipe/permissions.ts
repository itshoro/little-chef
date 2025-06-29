import "server-only";

import type { DrizzleRecipe, IdentifiedById } from "@/drizzle/schema";

import {
  unsafeGetRecipeByIdentifier,
  unsafeGetUserPermissionForRecipe,
} from "@/lib/dal/recipe";
import { RecipeNotFoundError } from "@/lib/errors/resource-not-found/recipe";
import { UnauthenticatedError } from "@/lib/errors/unauthenticated/error";
import { UnauthorizedError } from "@/lib/errors/unauthorized/error";
import { toIdentifier } from "@/lib/utils/to-identifier";
import type { AuthenticatedUser } from "../auth/types";

async function assertCanView(
  identifier: IdentifiedById<DrizzleRecipe>,
  user: AuthenticatedUser | null,
) {
  const recipe = await unsafeGetRecipeByIdentifier(identifier);
  if (!recipe) {
    throw new RecipeNotFoundError(toIdentifier(identifier));
  }

  if (recipe.visibility !== "private") return;
  if (!user) {
    throw new UnauthenticatedError();
  }

  const [permission] = await unsafeGetUserPermissionForRecipe(identifier, user);
  if (permission) return;

  throw new UnauthorizedError({
    name: "recipe",
    identifier: toIdentifier(recipe),
    user: toIdentifier(user),
  });
}

async function assertCanMaintain(
  identifier: IdentifiedById<DrizzleRecipe>,
  user: AuthenticatedUser,
) {
  const recipe = await unsafeGetRecipeByIdentifier(identifier);
  if (!recipe) {
    throw new RecipeNotFoundError(toIdentifier(identifier));
  }

  const [permission] = await unsafeGetUserPermissionForRecipe(identifier, user);
  if (permission && ["creator", "maintainer"].includes(permission.role)) {
    return;
  }

  throw new UnauthorizedError({
    name: "recipe",
    identifier: toIdentifier(recipe),
    user: toIdentifier(user),
  });
}

async function assertCanEdit(
  identifier: IdentifiedById<DrizzleRecipe>,
  user: AuthenticatedUser,
) {
  const recipe = await unsafeGetRecipeByIdentifier(identifier);
  if (!recipe) {
    throw new RecipeNotFoundError(toIdentifier(identifier));
  }

  const [permission] = await unsafeGetUserPermissionForRecipe(identifier, user);
  if (permission && permission.role !== "viewer") {
    return;
  }

  throw new UnauthorizedError({
    name: "recipe",
    identifier: toIdentifier(recipe),
    user: toIdentifier(user),
  });
}

export {
  assertCanEdit as assertCanEditRecipe,
  assertCanMaintain as assertCanMaintainRecipe,
  assertCanView as assertCanViewRecipe,
};
