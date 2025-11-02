import type { RecipePermissionRepository } from "@/lib/application/abstractions/recipe/recipe-permission-repository";
import type { RecipeRepository } from "@/lib/application/abstractions/recipe/recipe-repository";
import type { FileStorage } from "@/lib/application/shared/file-storage";
import type { Recipe } from "@/lib/domain/recipe/recipe";
import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";

export function makeDeleteRecipe(
  fileStorage: FileStorage,
  recipeRepository: RecipeRepository,
  recipePermissionRepository: RecipePermissionRepository,
) {
  return async function deleteRecipe(
    identifier: { publicId: Recipe["publicId"] } | { id: Recipe["id"] },
    user: User,
  ): Promise<Result<void>> {
    const recipeRes =
      "id" in identifier
        ? await recipeRepository.findById(identifier.id)
        : await recipeRepository.findByPublicId(identifier.publicId);

    if (!recipeRes.ok) return recipeRes;
    const recipe = recipeRes.value;

    const permissionResult =
      await recipePermissionRepository.canUpdatePermissions(recipe, user);
    if (!permissionResult.ok) return permissionResult;

    if (recipe.cover) await fileStorage.delete(recipe.cover);
    return await recipeRepository.delete(recipe);
  };
}
