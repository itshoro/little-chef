import { makeUpdateRecipe } from "@/application/use-case/recipe/update-recipe";
import type { Recipe } from "@/domain/recipe/recipe";
import type { RecipeUpdateError } from "@/domain/recipe/recipe-update-error";
import type { Result } from "@/domain/shared/result";
import { db } from "@/drizzle/db";
import { DrizzleRecipePermissionRepository } from "@/infrastructure/repositories/drizzle/recipe/recipe-permissions-repository";
import { DrizzleRecipeRepository } from "@/infrastructure/repositories/drizzle/recipe/recipe-repository";
import { DrizzleStepRepository } from "@/infrastructure/repositories/drizzle/recipe/step-repository";
import { UploadthingFileStorage } from "@/infrastructure/shared/uploadthing-file-storage";
import { UTApi } from "uploadthing/server";

export async function updateRecipe(
  ...args: Parameters<ReturnType<typeof makeUpdateRecipe>>
): Promise<Result<Recipe, RecipeUpdateError>> {
  try {
    return await db.transaction(async (tx) => {
      const fileStorage = new UploadthingFileStorage(new UTApi(), tx);
      const recipeRepository = new DrizzleRecipeRepository(tx);
      const recipePermissionRepository = new DrizzleRecipePermissionRepository(
        tx,
      );
      const stepRepository = new DrizzleStepRepository(tx);

      const updateRecipe = makeUpdateRecipe(
        fileStorage,
        recipeRepository,
        recipePermissionRepository,
        stepRepository,
      );

      const result = await updateRecipe(...args);
      if (!result.ok) throw result.error;

      return result;
    });
  } catch (e) {
    return { ok: false, error: e as Error };
  }
}
