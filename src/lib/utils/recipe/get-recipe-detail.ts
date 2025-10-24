import { db } from "@/drizzle/db";
import { makeGetRecipeDetail } from "@/lib/application/use-case/recipe/get-recipe-detail";
import { DrizzleRecipeReadRepository } from "@/lib/infrastructure/repositories/drizzle/recipe/recipe-read-repository";

export async function getRecipeDetail(
  ...args: Parameters<ReturnType<typeof makeGetRecipeDetail>>
) {
  const recipeReadRepository = new DrizzleRecipeReadRepository(db);

  const getRecipe = makeGetRecipeDetail(recipeReadRepository);
  return await getRecipe(...args);
}
