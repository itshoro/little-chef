import { makeDeleteRecipe } from "@/application/use-case/recipe/delete-recipe";
import type { Recipe } from "@/domain/recipe/recipe";
import type { User } from "@/domain/user/user";
import { db } from "@/drizzle/db";
import { DrizzleRecipePermissionRepository } from "@/infrastructure/repositories/drizzle/recipe/recipe-permissions-repository";
import { DrizzleRecipeRepository } from "@/infrastructure/repositories/drizzle/recipe/recipe-repository";
import { UploadthingFileStorage } from "@/infrastructure/shared/uploadthing-file-storage";
import { UTApi } from "uploadthing/server";

export async function deleteRecipe(
  identifier: { publicId: Recipe["publicId"] } | { id: Recipe["id"] },
  user: User,
) {
  await db.transaction(async (tx) => {
    const fileStorage = new UploadthingFileStorage(new UTApi(), tx);
    const recipeRepository = new DrizzleRecipeRepository(tx);
    const recipePermissionRepository = new DrizzleRecipePermissionRepository(
      tx,
    );

    const deleteRecipe = makeDeleteRecipe(
      fileStorage,
      recipeRepository,
      recipePermissionRepository,
    );

    await deleteRecipe(identifier, user);
  });
}
