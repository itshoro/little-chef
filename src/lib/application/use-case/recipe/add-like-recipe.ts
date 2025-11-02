import type { RecipeLikeRepository } from "@/lib/application/abstractions/recipe/recipe-like-repository";
import type { RecipePermissionRepository } from "@/lib/application/abstractions/recipe/recipe-permission-repository";
import type { RecipeRepository } from "@/lib/application/abstractions/recipe/recipe-repository";
import type { Recipe } from "@/lib/domain/recipe/recipe";
import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";

export function makeAddLikeRecipe(
  recipeRepository: RecipeRepository,
  recipeLikeRepository: RecipeLikeRepository,
  recipePermissionRepository: RecipePermissionRepository,
) {
  return async function addLikeRecipe(
    recipeIdentifier: { id: Recipe["id"] } | { publicId: Recipe["publicId"] },
    user: User,
  ): Promise<Result<void, Error>> {
    const recipeRes =
      "id" in recipeIdentifier
        ? await recipeRepository.findById(recipeIdentifier.id)
        : await recipeRepository.findByPublicId(recipeIdentifier.publicId);

    if (!recipeRes.ok) return recipeRes;
    const recipe = recipeRes.value;

    const permissionResult = await recipePermissionRepository.canView(
      recipe,
      user,
    );
    if (!permissionResult.ok) return permissionResult;

    return await recipeLikeRepository.likeRecipe(recipe, user);
  };
}
