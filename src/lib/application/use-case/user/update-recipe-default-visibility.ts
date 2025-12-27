import type { Result } from "@/lib/domain/shared/result";
import type { Visibility } from "@/lib/domain/shared/visibility";
import type { RecipePreferencesRepository } from "@/lib/application/abstractions/user/recipe-preferences-repository";
import type { User } from "@/lib/domain/user/user";

export function makeUpdateDefaultVisibility(
  recipePreferencesRepository: RecipePreferencesRepository,
) {
  return async function updateDefaultVisibility(
    user: User,
    visibility: Visibility,
  ): Promise<Result<void>> {
    const preferencesRes = await recipePreferencesRepository.findById(
      user.collectionPreferencesId,
    );
    if (!preferencesRes.ok) return preferencesRes;

    preferencesRes.value.defaultVisibility = visibility;
    return recipePreferencesRepository.update(preferencesRes.value);
  };
}
