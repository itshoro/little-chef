import { db } from "@/drizzle/db";
import { makeDeleteRecipe } from "@/lib/application/use-case/recipe/delete-recipe";
import type { Recipe } from "@/lib/domain/recipe/recipe";
import type { User } from "@/lib/domain/user/user";
import { DrizzleRecipePermissionRepository } from "@/lib/infrastructure/repositories/drizzle/recipe/recipe-permissions-repository";
import { DrizzleRecipeRepository } from "@/lib/infrastructure/repositories/drizzle/recipe/recipe-repository";
import { UploadthingFileStorage } from "@/lib/infrastructure/shared/uploadthing-file-storage";
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
