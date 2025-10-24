import type { RecipeLikeRepository } from "@/lib/application/abstractions/recipe/recipe-like-repository";
import type { RecipePermissionRepository } from "@/lib/application/abstractions/recipe/recipe-permission-repository";
import type { RecipeRepository } from "@/lib/application/abstractions/recipe/recipe-repository";
import type { Recipe } from "@/lib/domain/recipe/recipe";
import { RecipeNotFoundError } from "@/lib/domain/recipe/recipe-not-found-error";
import type { User } from "@/lib/domain/user/user";

export function makeRemoveLikeRecipe(
  recipeRepository: RecipeRepository,
  recipeLikeRepository: RecipeLikeRepository,
  recipePermissionRepository: RecipePermissionRepository,
) {
  return async function removeLikeRecipe(
    identifier: { id: Recipe["id"] } | { publicId: Recipe["publicId"] },
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
    return await recipeLikeRepository.unlikeRecipe(recipe, user);
  };
}
