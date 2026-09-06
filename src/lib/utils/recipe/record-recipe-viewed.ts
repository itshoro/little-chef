import { db } from "@/drizzle/db";
import { makeRecordRecipeViewed } from "@/lib/application/use-case/user/record-recipe-viewed";
import { DrizzleHistoryPreferencesRepository } from "@/lib/infrastructure/repositories/drizzle/user/history-preferences-repository";
import { DrizzleRecipeHistoryRepository } from "@/lib/infrastructure/repositories/drizzle/user/recipe-history-repository";

export async function recordRecipeViewed(
  ...args: Parameters<ReturnType<typeof makeRecordRecipeViewed>>
) {
  const historyPreferencesRepository = new DrizzleHistoryPreferencesRepository(
    db,
  );
  const recipeHistoryRepository = new DrizzleRecipeHistoryRepository(db);

  const recordView = makeRecordRecipeViewed(
    historyPreferencesRepository,
    recipeHistoryRepository,
  );
  return await recordView(...args);
}
