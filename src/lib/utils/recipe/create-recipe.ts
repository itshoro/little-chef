import { makeCreateRecipe } from "@/application/use-case/recipe/create-recipe";
import type { Recipe } from "@/domain/recipe/recipe";
import type { RecipeCreationError } from "@/application/abstractions/recipe/recipe-creation-error";
import type { Result } from "@/domain/shared/result";
import { db } from "@/drizzle/db";
import { DrizzleRecipePermissionRepository } from "@/infrastructure/repositories/drizzle/recipe/recipe-permissions-repository";
import { DrizzleRecipeRepository } from "@/infrastructure/repositories/drizzle/recipe/recipe-repository";
import { DrizzleStepRepository } from "@/infrastructure/repositories/drizzle/recipe/step-repository";
import { UploadthingFileStorage } from "@/infrastructure/shared/uploadthing-file-storage";
import { UTApi } from "uploadthing/server";

export async function createRecipe(
  ...args: Parameters<ReturnType<typeof makeCreateRecipe>>
): Promise<Result<Recipe, RecipeCreationError>> {
  try {
    return await db.transaction(async (tx) => {
      const createRecipe = makeCreateRecipe(
        new UploadthingFileStorage(new UTApi(), tx),
        new DrizzleRecipeRepository(tx),
        new DrizzleRecipePermissionRepository(tx),
        new DrizzleStepRepository(tx),
      );

      const result = await createRecipe(...args);
      if (!result.ok) throw result.error;

      return result;
    });
  } catch (e) {
    return { ok: false, error: e as Error };
  }
}
