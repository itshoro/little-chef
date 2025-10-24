import type { RecipeLikeRepository } from "@/lib/application/abstractions/recipe/recipe-like-repository";
import type { RecipePermissionRepository } from "@/lib/application/abstractions/recipe/recipe-permission-repository";
import type { RecipeRepository } from "@/lib/application/abstractions/recipe/recipe-repository";
import type { User } from "@/lib/domain/user/user";
import type { RecipeIdentifier } from "@/drizzle/schema";
import { RecipeNotFoundError } from "@/lib/errors/resource-not-found/recipe";

export function makeIsRecipeLiked(
  recipeRepository: RecipeRepository,
  recipeLikeRepository: RecipeLikeRepository,
  recipePermissionRepository: RecipePermissionRepository,
) {
  return async function isRecipeLiked(
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

    return await recipeLikeRepository.hasUserLiked(recipe, user);
  };
}
