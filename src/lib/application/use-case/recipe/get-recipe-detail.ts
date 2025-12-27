import type { RecipeReadRepository } from "@/lib/application/abstractions/recipe/recipe-read-repository";
import type { Recipe, RecipeDetail } from "@/lib/domain/recipe/recipe";
import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";
import { taintObjectReference } from "next/dist/server/app-render/entry-base";

export function makeGetRecipeDetail(recipeRepository: RecipeReadRepository) {
  return async function getRecipeDetail(
    identifier: { id: Recipe["id"] } | { publicId: Recipe["publicId"] },
    user: User | null,
  ): Promise<Result<RecipeDetail>> {
    const recipeRes = await recipeRepository.findDetailByIdentifier(
      identifier,
      user,
    );

    if (!recipeRes.ok) return recipeRes;

    taintObjectReference(
      "recipeDetails may not be passed over the network boundary, consider calling `toPublicRecipeDetail` first.",
      recipeRes.value,
    );

    return recipeRes;
  };
}
