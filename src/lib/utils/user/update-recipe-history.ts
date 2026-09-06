import { db } from "@/drizzle/db";
import { makeUpdateRecipeTrackingEnabled } from "@/lib/application/use-case/user/update-recipe-tracking-enabled";
import { DrizzleHistoryPreferencesRepository } from "@/lib/infrastructure/repositories/drizzle/user/history-preferences-repository";

export async function updateDefaultVisibility(
  ...args: Parameters<ReturnType<typeof makeUpdateRecipeTrackingEnabled>>
): Promise<ReturnType<ReturnType<typeof makeUpdateRecipeTrackingEnabled>>> {
  try {
    return await db.transaction(async (tx) => {
      const recipePreferencesRepository =
        new DrizzleHistoryPreferencesRepository(tx);

      const updateDefaultVisibility = makeUpdateRecipeTrackingEnabled(
        recipePreferencesRepository,
      );

      const result = await updateDefaultVisibility(...args);
      if (!result.ok) throw result.error;

      return result;
    });
  } catch (e) {
    return { ok: false, error: e as Error };
  }
}
