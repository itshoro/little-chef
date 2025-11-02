import { db } from "@/drizzle/db";
import { makeGetRecipeDetail } from "@/lib/application/use-case/recipe/get-recipe-detail";
import { DrizzleRecipeReadRepository } from "@/lib/infrastructure/repositories/drizzle/recipe/recipe-read-repository";
import { taintObjectReference } from "next/dist/server/app-render/entry-base";

export async function getRecipeDetail(
  ...args: Parameters<ReturnType<typeof makeGetRecipeDetail>>
) {
  const recipeReadRepository = new DrizzleRecipeReadRepository(db);

  const getRecipe = makeGetRecipeDetail(recipeReadRepository);
  const result = await getRecipe(...args);
  if (!result.ok) return result;

  taintObjectReference(
    "recipes may not be passed over the network boundary, consider calling `toPublicRecipe` first",
    result.value,
  );

  return result;
}
