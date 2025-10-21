import { makeUpdateDefaultVisibility } from "@/application/use-case/user/update-recipe-default-visibility";
import { db } from "@/drizzle/db";
import { DrizzleRecipePreferencesRepository } from "@/infrastructure/repositories/drizzle/user/recipe-preferences-repository";

export async function updateDefaultVisibility(
  ...args: Parameters<ReturnType<typeof makeUpdateDefaultVisibility>>
): Promise<ReturnType<ReturnType<typeof makeUpdateDefaultVisibility>>> {
  try {
    return await db.transaction(async (tx) => {
      const recipePreferencesRepository =
        new DrizzleRecipePreferencesRepository(tx);

      const updateDefaultVisibility = makeUpdateDefaultVisibility(
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
