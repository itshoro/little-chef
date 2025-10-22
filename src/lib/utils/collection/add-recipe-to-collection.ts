import { makeAddRecipeToCollection } from "@/application/use-case/collection/add-recipe-to-collection";
import { db } from "@/drizzle/db";
import { DrizzleCollectionPermissionRepository } from "@/infrastructure/repositories/drizzle/collection/collection-permission-repository";
import { DrizzleCollectionRecipeRepository } from "@/infrastructure/repositories/drizzle/collection/collection-recipe-repository";
import { DrizzleCollectionRepository } from "@/infrastructure/repositories/drizzle/collection/collection-repository";
import { DrizzleRecipePermissionRepository } from "@/infrastructure/repositories/drizzle/recipe/recipe-permissions-repository";

export async function addRecipeToCollection(
  ...args: Parameters<ReturnType<typeof makeAddRecipeToCollection>>
) {
  return await db.transaction(async (tx) => {
    const collectionRepository = new DrizzleCollectionRepository(tx);
    const collectionRecipeRepository = new DrizzleCollectionRecipeRepository(
      tx,
    );
    const recipePermissionRepository = new DrizzleRecipePermissionRepository(
      tx,
    );
    const collectionPermissionRepository =
      new DrizzleCollectionPermissionRepository(tx);

    const addRecipeToCollection = makeAddRecipeToCollection(
      collectionRepository,
      collectionRecipeRepository,
      collectionPermissionRepository,
      recipePermissionRepository,
    );

    return addRecipeToCollection(...args);
  });
}
