import { db } from "@/drizzle/db";
import { makeUpdateRecipeTrackingEnabled } from "@/lib/application/use-case/user/update-recipe-tracking-enabled";
import { DrizzleHistoryPreferencesRepository } from "@/lib/infrastructure/repositories/drizzle/user/history-preferences-repository";

export function updateRecipeHistoryEnabled(
  ...args: Parameters<ReturnType<typeof makeUpdateRecipeTrackingEnabled>>
) {
  const historyPreferencesRepository = new DrizzleHistoryPreferencesRepository(
    db,
  );

  const updateRecipeTracking = makeUpdateRecipeTrackingEnabled(
    historyPreferencesRepository,
  );

  return updateRecipeTracking(...args);
}
