import { makeUpdateDefaultVisibility } from "@/application/use-case/user/update-collection-default-visibility";
import { db } from "@/drizzle/db";
import { DrizzleCollectionPreferencesRepository } from "@/infrastructure/repositories/drizzle/user/collection-preferences-repository";

export async function updateDefaultVisibility(
  ...args: Parameters<ReturnType<typeof makeUpdateDefaultVisibility>>
): Promise<ReturnType<ReturnType<typeof makeUpdateDefaultVisibility>>> {
  try {
    return await db.transaction(async (tx) => {
      const collectionPreferencesRepository =
        new DrizzleCollectionPreferencesRepository(tx);

      const updateDefaultVisibility = makeUpdateDefaultVisibility(
        collectionPreferencesRepository,
      );

      const result = await updateDefaultVisibility(...args);
      if (!result.ok) throw result.error;

      return result;
    });
  } catch (e) {
    return { ok: false, error: e as Error };
  }
}
