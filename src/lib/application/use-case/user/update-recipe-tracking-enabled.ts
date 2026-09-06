import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";
import type { HistoryPreferencesRepository } from "../../abstractions/user/history-preferences-repository";

export function makeUpdateRecipeTrackingEnabled(
  historyPreferencesRepository: HistoryPreferencesRepository,
) {
  return async function updateRecipeTrackingEnabled(
    user: User,
    enabled: boolean,
  ): Promise<Result<void>> {
    const preferencesRes = await historyPreferencesRepository.findByUserId(
      user.id,
    );

    if (!preferencesRes.ok) return preferencesRes;
    preferencesRes.value.recipeTrackingEnabled = enabled;

    return historyPreferencesRepository.update(preferencesRes.value);
  };
}
