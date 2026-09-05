import type { Result } from "@/lib/domain/shared/result";
import type { RecipePreferencesRepository } from "@/lib/application/abstractions/user/recipe-preferences-repository";
import type { User } from "@/lib/domain/user/user";

export function makeUpdateDefaultServingSize(
  recipePreferencesRepository: RecipePreferencesRepository,
) {
  return async function updateDefaultServingSize(
    user: User,
    servingSize: number,
  ): Promise<Result<void>> {
    const preferencesRes = await recipePreferencesRepository.findByUserId(
      user.id,
    );
    if (!preferencesRes.ok) return preferencesRes;
    preferencesRes.value.defaultServingSize = servingSize;

    return recipePreferencesRepository.update(preferencesRes.value);
  };
}
