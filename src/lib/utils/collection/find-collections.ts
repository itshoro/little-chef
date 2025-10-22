import { makeFindCollections } from "@/application/use-case/collection/find-collections";
import { db } from "@/drizzle/db";
import { DrizzleCollectionReadRepository } from "@/infrastructure/repositories/drizzle/collection/collection-read-repository";

export async function findCollections(
  ...args: Parameters<ReturnType<typeof makeFindCollections>>
): ReturnType<ReturnType<typeof makeFindCollections>> {
  return await db.transaction(async (tx) => {
    const collectionReadRepository = new DrizzleCollectionReadRepository(tx);

    const findCollections = makeFindCollections(collectionReadRepository);
    return await findCollections(...args);
  });
}
