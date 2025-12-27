import type { RecipeLikeRepository } from "@/lib/application/abstractions/recipe/recipe-like-repository";
import type { RecipePermissionRepository } from "@/lib/application/abstractions/recipe/recipe-permission-repository";
import type { RecipeRepository } from "@/lib/application/abstractions/recipe/recipe-repository";
import type { Recipe } from "@/lib/domain/recipe/recipe";
import type { User } from "@/lib/domain/user/user";

export function makeRemoveLikeRecipe(
  recipeRepository: RecipeRepository,
  recipeLikeRepository: RecipeLikeRepository,
  recipePermissionRepository: RecipePermissionRepository,
) {
  return async function removeLikeRecipe(
    recipeIdentifier: { id: Recipe["id"] } | { publicId: Recipe["publicId"] },
    user: User,
  ) {
    const recipeResult =
      "id" in recipeIdentifier
        ? await recipeRepository.findById(recipeIdentifier.id)
        : await recipeRepository.findByPublicId(recipeIdentifier.publicId);

    if (!recipeResult.ok) return recipeResult;
    const recipe = recipeResult.value;

    const permissionResult = await recipePermissionRepository.canView(
      recipe,
      user,
    );
    if (!permissionResult.ok) return permissionResult;

    return await recipeLikeRepository.unlikeRecipe(recipe, user);
  };
}
