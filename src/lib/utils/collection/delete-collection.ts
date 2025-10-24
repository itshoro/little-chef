import { makeDeleteCollection } from "@/lib/application/use-case/collection/delete-collection";
import type { Result } from "@/lib/domain/shared/result";
import { db } from "@/drizzle/db";
import { DrizzleCollectionPermissionRepository } from "@/lib/infrastructure/repositories/drizzle/collection/collection-permission-repository";
import { DrizzleCollectionRepository } from "@/lib/infrastructure/repositories/drizzle/collection/collection-repository";

export async function deleteCollection(
  ...args: Parameters<ReturnType<typeof makeDeleteCollection>>
): Promise<Result<void, Error>> {
  try {
    return await db.transaction(async (tx) => {
      const deleteCollection = makeDeleteCollection(
        new DrizzleCollectionRepository(tx),
        new DrizzleCollectionPermissionRepository(tx),
      );

      const result = await deleteCollection(...args);
      if (!result.ok) throw result.error;

      return result;
    });
  } catch (e) {
    return { ok: false, error: e as Error };
  }
}
