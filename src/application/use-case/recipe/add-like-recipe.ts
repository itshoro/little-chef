import type { RecipeLikeRepository } from "@/application/abstractions/recipe/recipe-like-repository";
import type { RecipePermissionRepository } from "@/application/abstractions/recipe/recipe-permission-repository";
import type { RecipeRepository } from "@/application/abstractions/recipe/recipe-repository";
import type { User } from "@/domain/user/user";
import type { RecipeIdentifier } from "@/drizzle/schema";
import { RecipeNotFoundError } from "@/lib/errors/resource-not-found/recipe";

export function makeAddLikeRecipe(
  recipeRepository: RecipeRepository,
  recipeLikeRepository: RecipeLikeRepository,
  recipePermissionRepository: RecipePermissionRepository,
) {
  return async function addLikeRecipe(
    identifier: RecipeIdentifier,
    user: User,
  ) {
    const recipe =
      "id" in identifier
        ? await recipeRepository.findById(identifier.id)
        : await recipeRepository.findByPublicId(identifier.publicId);

    if (!recipe) {
      throw new RecipeNotFoundError(identifier);
    }

    await recipePermissionRepository.canView(recipe, user);
    return await recipeLikeRepository.likeRecipe(recipe.id, user.id);
  };
}
