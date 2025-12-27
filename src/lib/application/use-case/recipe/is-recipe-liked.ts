import type { RecipeLikeRepository } from "@/lib/application/abstractions/recipe/recipe-like-repository";
import type { RecipePermissionRepository } from "@/lib/application/abstractions/recipe/recipe-permission-repository";
import type { RecipeRepository } from "@/lib/application/abstractions/recipe/recipe-repository";
import type { Recipe } from "@/lib/domain/recipe/recipe";
import type { User } from "@/lib/domain/user/user";

export function makeIsRecipeLiked(
  recipeRepository: RecipeRepository,
  recipeLikeRepository: RecipeLikeRepository,
  recipePermissionRepository: RecipePermissionRepository,
) {
  return async function isRecipeLiked(
    identifier: { id: Recipe["id"] } | { publicId: Recipe["publicId"] },
    user: User,
  ) {
    const recipeRes =
      "id" in identifier
        ? await recipeRepository.findById(identifier.id)
        : await recipeRepository.findByPublicId(identifier.publicId);

    if (!recipeRes.ok) return recipeRes;
    const recipe = recipeRes.value;

    const permissionRes = await recipePermissionRepository.canView(
      recipe,
      user,
    );
    if (!permissionRes.ok) return permissionRes;

    return await recipeLikeRepository.hasUserLiked(recipe, user);
  };
}
