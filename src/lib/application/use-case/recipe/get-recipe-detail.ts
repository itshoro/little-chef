import type { RecipeReadRepository } from "@/lib/application/abstractions/recipe/recipe-read-repository";
import type { Recipe, RecipeDetail } from "@/lib/domain/recipe/recipe";
import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";

export function makeGetRecipeDetail(recipeRepository: RecipeReadRepository) {
  return async function getRecipeDetail(
    identifier: { id: Recipe["id"] } | { publicId: Recipe["publicId"] },
    user: User | null,
  ): Promise<Result<RecipeDetail | null, Error>> {
    const recipe = await recipeRepository.findDetailByIdentifier(
      identifier,
      user,
    );

    return { ok: true, value: recipe };
  };
}
