import { db } from "@/drizzle/db";
import { makeRemoveRecipeFromCollection } from "@/lib/application/use-case/collection/remove-recipe-from-collection";
import { DrizzleCollectionPermissionRepository } from "@/lib/infrastructure/repositories/drizzle/collection/collection-permission-repository";
import { DrizzleCollectionRecipeRepository } from "@/lib/infrastructure/repositories/drizzle/collection/collection-recipe-repository";
import { DrizzleCollectionRepository } from "@/lib/infrastructure/repositories/drizzle/collection/collection-repository";
import { DrizzleRecipePermissionRepository } from "@/lib/infrastructure/repositories/drizzle/recipe/recipe-permissions-repository";

export async function removeRecipeFromCollection(
  ...args: Parameters<ReturnType<typeof makeRemoveRecipeFromCollection>>
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

    const removeRecipeFromCollection = makeRemoveRecipeFromCollection(
      collectionRepository,
      collectionRecipeRepository,
      collectionPermissionRepository,
      recipePermissionRepository,
    );

    return removeRecipeFromCollection(...args);
  });
}
