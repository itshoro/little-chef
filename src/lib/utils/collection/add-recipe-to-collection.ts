import { db } from "@/drizzle/db";
import { makeAddRecipeToCollection } from "@/lib/application/use-case/collection/add-recipe-to-collection";
import type { Collection } from "@/lib/domain/collection/collection";
import type { Recipe } from "@/lib/domain/recipe/recipe";
import type { User } from "@/lib/domain/user/user";
import { DrizzleCollectionPermissionRepository } from "@/lib/infrastructure/repositories/drizzle/collection/collection-permission-repository";
import { DrizzleCollectionRecipeRepository } from "@/lib/infrastructure/repositories/drizzle/collection/collection-recipe-repository";
import { DrizzleCollectionRepository } from "@/lib/infrastructure/repositories/drizzle/collection/collection-repository";
import { DrizzleRecipePermissionRepository } from "@/lib/infrastructure/repositories/drizzle/recipe/recipe-permissions-repository";
import { DrizzleRecipeRepository } from "@/lib/infrastructure/repositories/drizzle/recipe/recipe-repository";

export async function addRecipeToCollection(
  collectionIdentifier:
    | { id: Collection["id"] }
    | { publicId: Collection["publicId"] },
  recipeIdentifier: { id: Recipe["id"] } | { publicId: Recipe["publicId"] },
  user: User,
) {
  return await db.transaction(async (tx) => {
    const collectionRepository = new DrizzleCollectionRepository(tx);
    const collectionRecipeRepository = new DrizzleCollectionRecipeRepository(
      tx,
    );
    const recipeRepository = new DrizzleRecipeRepository(tx);
    const recipePermissionRepository = new DrizzleRecipePermissionRepository(
      tx,
    );
    const collectionPermissionRepository =
      new DrizzleCollectionPermissionRepository(tx);

    const addRecipeToCollection = makeAddRecipeToCollection(
      collectionRepository,
      collectionRecipeRepository,
      collectionPermissionRepository,
      recipeRepository,
      recipePermissionRepository,
    );

    return addRecipeToCollection(collectionIdentifier, recipeIdentifier, user);
  });
}
