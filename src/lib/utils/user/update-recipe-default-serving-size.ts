import { db } from "@/drizzle/db";
import { makeUpdateDefaultServingSize } from "@/lib/application/use-case/user/update-recipe-default-serving-size";
import { DrizzleRecipePreferencesRepository } from "@/lib/infrastructure/repositories/drizzle/user/recipe-preferences-repository";

export async function updateDefaultServingSize(
  ...args: Parameters<ReturnType<typeof makeUpdateDefaultServingSize>>
): Promise<ReturnType<ReturnType<typeof makeUpdateDefaultServingSize>>> {
  try {
    return await db.transaction(async (tx) => {
      const recipePreferencesRepository =
        new DrizzleRecipePreferencesRepository(tx);

      const updateDefaultServingSize = makeUpdateDefaultServingSize(
        recipePreferencesRepository,
      );

      const result = await updateDefaultServingSize(...args);
      if (!result.ok) throw result.error;

      return result;
    });
  } catch (e) {
    return { ok: false, error: e as Error };
  }
}
