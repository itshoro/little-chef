import { makeCreateCollection } from "@/application/use-case/collection/create-collection";
import { db } from "@/drizzle/db";
import { DrizzleCollectionPermissionRepository } from "@/infrastructure/repositories/drizzle/collection/collection-permission-repository";
import { DrizzleCollectionRepository } from "@/infrastructure/repositories/drizzle/collection/collection-repository";

export async function createCollection(
  ...args: Parameters<ReturnType<typeof makeCreateCollection>>
): ReturnType<ReturnType<typeof makeCreateCollection>> {
  try {
    return await db.transaction(async (tx) => {
      const createCollection = makeCreateCollection(
        new DrizzleCollectionRepository(tx),
        new DrizzleCollectionPermissionRepository(tx),
      );

      const result = await createCollection(...args);
      if (!result.ok) throw result.error;

      return result;
    });
  } catch (e) {
    return { ok: false, error: e as Error };
  }
}
