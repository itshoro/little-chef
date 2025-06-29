import type { DrizzleRecipe, DrizzleRecipeStep } from "@/drizzle/schema";
import type { RecipeOutputPublicDTO, RecipeStepOutputPublicDTO } from "./types";

export function toRecipeOutputPublicDTO(
  recipe: DrizzleRecipe,
): RecipeOutputPublicDTO {
  return {
    cookingTime: recipe.cookingTime,
    coverSrc: recipe.coverSrc,
    description: recipe.description,
    likes: recipe.likes,
    name: recipe.name,
    preparationTime: recipe.preparationTime,
    publicId: recipe.publicId,
    recommendedServingSize: recipe.recommendedServingSize,
    slug: recipe.slug,
    visibility: recipe.visibility,
  };
}

export function toRecipeStepOutputPublicDTO(
  recipeStep: DrizzleRecipeStep,
): RecipeStepOutputPublicDTO {
  return {
    description: recipeStep.description,
    order: recipeStep.order,
    publicId: recipeStep.publicId,
    recipeId: recipeStep.recipeId,
  };
}
