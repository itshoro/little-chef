import type { RecipeReadRepository } from "@/application/abstractions/recipe/recipe-read-repository";
import type { Recipe, RecipeDetail } from "@/domain/recipe/recipe";
import type { Result } from "@/domain/shared/result";
import type { User } from "@/domain/user/user";

export function makeGetRecipeDetail(recipeRepository: RecipeReadRepository) {
  return async function getRecipeDetail(
    identifier: { id: Recipe["id"] } | { publicId: Recipe["publicId"] },
    user: User | null,
  ): Promise<Result<RecipeDetail | null, Error>> {
    const recipe = await recipeRepository.findByIdentifier(identifier, user);

    return { ok: true, value: recipe };
  };
}
