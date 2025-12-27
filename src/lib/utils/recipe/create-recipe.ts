import { db } from "@/drizzle/db";
import { makeCreateRecipe } from "@/lib/application/use-case/recipe/create-recipe";
import type { Recipe } from "@/lib/domain/recipe/recipe";
import type { RecipeCreationError } from "@/lib/domain/recipe/recipe-creation-error";
import type { Result } from "@/lib/domain/shared/result";
import { DrizzleRecipePermissionRepository } from "@/lib/infrastructure/repositories/drizzle/recipe/recipe-permissions-repository";
import { DrizzleRecipeRepository } from "@/lib/infrastructure/repositories/drizzle/recipe/recipe-repository";
import { DrizzleStepRepository } from "@/lib/infrastructure/repositories/drizzle/recipe/step-repository";
import { UploadthingFileStorage } from "@/lib/infrastructure/shared/uploadthing-file-storage";
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
