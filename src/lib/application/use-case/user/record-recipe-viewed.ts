import type { ResourceHistoryRepository } from "@/lib/application/abstractions/user/history-repository";
import type { Recipe } from "@/lib/domain/recipe/recipe";
import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";
import type { HistoryPreferencesRepository } from "../../abstractions/user/history-preferences-repository";

export function makeRecordRecipeViewed(
  historyPreferencesRepository: HistoryPreferencesRepository,
  recipeHistoryRepository: ResourceHistoryRepository<Recipe>,
) {
  return async function recordRecipeViewed(
    user: User,
    recipe: Recipe,
  ): Promise<Result<void>> {
    const preferences = await historyPreferencesRepository.findByUserId(
      user.id,
    );

    if (!preferences.ok) return preferences;
    if (!preferences.value.recipeTrackingEnabled) {
      return { ok: false, error: new Error("Recipe history is disabled.") };
    }

    return await recipeHistoryRepository.upsertRecord(recipe, user);
  };
}
