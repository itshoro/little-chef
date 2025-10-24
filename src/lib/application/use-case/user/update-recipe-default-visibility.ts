import type { Result } from "@/lib/domain/shared/result";
import type { Visibility } from "@/lib/domain/shared/visibility";
import type { RecipePreferencesRepository } from "@/lib/domain/user/recipe-preferences-repository";
import type { User } from "@/lib/domain/user/user";

export function makeUpdateDefaultVisibility(
  recipePreferencesRepository: RecipePreferencesRepository,
) {
  return async function updateDefaultVisibility(
    user: User,
    visibility: Visibility,
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

    preferences.defaultVisibility = visibility;
    const result = recipePreferencesRepository.update(preferences);

    return result;
  };
}
