import type { Result } from "../../../domain/shared/result";
import type { Recipe } from "../../../domain/recipe/recipe";
import type { Step } from "../../../domain/recipe/step";

export interface StepRepository {
  createSteps(
    recipeId: Recipe["id"],
    steps: Step[],
  ): Promise<Result<void, Error>>;
  deleteStepsForRecipe(recipeId: Recipe["id"]): Promise<Result<void, Error>>;
  getStepsForRecipe(recipeId: Recipe["id"]): Promise<Result<Step[], Error>>;
}
