import type { Result } from "@/domain/shared/result";
import type { RecipePreferencesRepository } from "@/domain/user/recipe-preferences-repository";
import type { User } from "@/domain/user/user";

export function makeUpdateDefaultServingSize(
  recipePreferencesRepository: RecipePreferencesRepository,
) {
  return async function updateDefaultServingSize(
    user: User,
    servingSize: number,
  ): Promise<Result<void, Error>> {
    const preferences = await recipePreferencesRepository.findById(
      user.collectionPreferencesId,
    );
    if (!preferences) {
      return {
        ok: false,
        error: new Error("Recipe preferences not found"),
      };
    }

    preferences.defaultServingSize = servingSize;
    const result = recipePreferencesRepository.update(preferences);

    return result;
  };
}
