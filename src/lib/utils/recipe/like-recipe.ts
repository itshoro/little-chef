import { db } from "@/drizzle/db";
import { makeAddLikeRecipe } from "@/lib/application/use-case/recipe/add-like-recipe";
import { makeIsRecipeLiked } from "@/lib/application/use-case/recipe/is-recipe-liked";
import { makeRemoveLikeRecipe } from "@/lib/application/use-case/recipe/remove-like-recipe";
import type { Recipe } from "@/lib/domain/recipe/recipe";
import type { User } from "@/lib/domain/user/user";
import { DrizzleRecipeLikeRepository } from "@/lib/infrastructure/repositories/drizzle/recipe/recipe-like-repository";
import { DrizzleRecipePermissionRepository } from "@/lib/infrastructure/repositories/drizzle/recipe/recipe-permissions-repository";
import { DrizzleRecipeRepository } from "@/lib/infrastructure/repositories/drizzle/recipe/recipe-repository";

export async function likeRecipe(
  identifier: { id: Recipe["id"] } | { publicId: Recipe["publicId"] },
  user: User,
) {
  return await db.transaction(async (tx) => {
    const recipeRepository = new DrizzleRecipeRepository(tx);
    const recipeLikeRepository = new DrizzleRecipeLikeRepository(tx);
    const recipePermissionRepository = new DrizzleRecipePermissionRepository(
      tx,
    );

    const like = makeAddLikeRecipe(
      recipeRepository,
      recipeLikeRepository,
      recipePermissionRepository,
    );

    return await like(identifier, user);
  });
}

export async function unlikeRecipe(
  identifier: { id: Recipe["id"] } | { publicId: Recipe["publicId"] },
  user: User,
) {
  return await db.transaction(async (tx) => {
    const recipeRepository = new DrizzleRecipeRepository(tx);
    const recipeLikeRepository = new DrizzleRecipeLikeRepository(tx);
    const recipePermissionRepository = new DrizzleRecipePermissionRepository(
      tx,
    );

    const unlike = makeRemoveLikeRecipe(
      recipeRepository,
      recipeLikeRepository,
      recipePermissionRepository,
    );

    return await unlike(identifier, user);
  });
}

export async function isRecipeLiked(
  recipeIdentifier: { id: Recipe["id"] } | { publicId: Recipe["publicId"] },
  user: User,
) {
  const recipeRepository = new DrizzleRecipeRepository(db);
  const recipeLikeRepository = new DrizzleRecipeLikeRepository(db);
  const recipePermissionRepository = new DrizzleRecipePermissionRepository(db);

  const likeChecker = makeIsRecipeLiked(
    recipeRepository,
    recipeLikeRepository,
    recipePermissionRepository,
  );

  return await likeChecker(recipeIdentifier, user);
}
