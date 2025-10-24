import { makeUpdateCollection } from "@/lib/application/use-case/collection/update-collection";
import { db } from "@/drizzle/db";
import { DrizzleCollectionPermissionRepository } from "@/lib/infrastructure/repositories/drizzle/collection/collection-permission-repository";
import { DrizzleCollectionRepository } from "@/lib/infrastructure/repositories/drizzle/collection/collection-repository";

export async function updateCollection(
  ...args: Parameters<ReturnType<typeof makeUpdateCollection>>
): ReturnType<ReturnType<typeof makeUpdateCollection>> {
  try {
    return await db.transaction(async (tx) => {
      const collectionRepository = new DrizzleCollectionRepository(tx);
      const collectionPermissionRepository =
        new DrizzleCollectionPermissionRepository(tx);

      const updateCollection = makeUpdateCollection(
        collectionRepository,
        collectionPermissionRepository,
      );

      const result = await updateCollection(...args);
      if (!result.ok) throw result.error;

      return result;
    });
  } catch (e) {
    return { ok: false, error: e as Error };
  }
}
