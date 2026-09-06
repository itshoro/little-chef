import { db } from "@/drizzle/db";
import { makeUpdateDefaultVisibility } from "@/lib/application/use-case/user/update-collection-default-visibility";
import { DrizzleCollectionPreferencesRepository } from "@/lib/infrastructure/repositories/drizzle/user/collection-preferences-repository";

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

      return await updateDefaultVisibility(...args);
    });
  } catch (e) {
    return { ok: false, error: e as Error };
  }
}
