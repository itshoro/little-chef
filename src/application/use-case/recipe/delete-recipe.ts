import type { Recipe } from "@/domain/recipe/recipe";
import type { RecipePermissionRepository } from "@/application/abstractions/recipe/recipe-permission-repository";
import type { RecipeRepository } from "@/application/abstractions/recipe/recipe-repository";
import type { FileStorage } from "@/application/shared/file-storage";
import type { User } from "@/domain/user/user";
import { RecipeNotFoundError } from "@/lib/errors/resource-not-found/recipe";

export function makeDeleteRecipe(
  fileStorage: FileStorage,
  recipeRepository: RecipeRepository,
  recipePermissionRepository: RecipePermissionRepository,
) {
  return async function deleteRecipe(
    identifier: { publicId: Recipe["publicId"] } | { id: Recipe["id"] },
    user: User,
  ) {
    const recipe =
      "id" in identifier
        ? await recipeRepository.findById(identifier.id)
        : await recipeRepository.findByPublicId(identifier.publicId);

    if (!recipe) {
      throw new RecipeNotFoundError(identifier);
    }

    if (
      !(await recipePermissionRepository.canUpdatePermissions(recipe, user))
    ) {
      throw new Error("User does not have permission to delete this recipe");
    }

    if (recipe.cover) await fileStorage.delete(recipe.cover);
    await recipeRepository.delete(recipe);
  };
}
