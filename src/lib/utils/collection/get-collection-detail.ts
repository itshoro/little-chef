import { db } from "@/drizzle/db";
import { makeGetCollectionDetail } from "@/lib/application/use-case/collection/get-collection-detail";
import type { CollectionDetail } from "@/lib/domain/collection/collection";
import type { Result } from "@/lib/domain/shared/result";
import { DrizzleCollectionPermissionRepository } from "@/lib/infrastructure/repositories/drizzle/collection/collection-permission-repository";
import { DrizzleCollectionRecipeRepository } from "@/lib/infrastructure/repositories/drizzle/collection/collection-recipe-repository";
import { DrizzleCollectionRepository } from "@/lib/infrastructure/repositories/drizzle/collection/collection-repository";

export async function getCollectionDetail(
  ...args: Parameters<ReturnType<typeof makeGetCollectionDetail>>
): Promise<Result<CollectionDetail>> {
  try {
    return await db.transaction(async (tx) => {
      const collectionRepository = new DrizzleCollectionRepository(tx);
      const collectionPermissionRepository =
        new DrizzleCollectionPermissionRepository(tx);
      const collectionRecipeRepository = new DrizzleCollectionRecipeRepository(
        tx,
      );

      const getCollectionDetail = makeGetCollectionDetail(
        collectionRepository,
        collectionPermissionRepository,
        collectionRecipeRepository,
      );

      const result = await getCollectionDetail(...args);
      if (!result.ok) throw result.error;

      return result;
    });
  } catch (error) {
    return { ok: false, error: error as Error };
  }
}
