import type { Recipe, RecipeDetail } from "../../../domain/recipe/recipe";
import type { Step } from "../../../domain/recipe/step";
import type { Result } from "../../../domain/shared/result";

export interface StepRepository {
  createSteps(
    recipe: Recipe,
    steps: Step[],
  ): Promise<Result<RecipeDetail, Error>>;
  deleteStepsForRecipe(recipeId: Recipe): Promise<Result<RecipeDetail, Error>>;
  getStepsForRecipe(recipeId: Recipe): Promise<Result<Step[], Error>>;
}
