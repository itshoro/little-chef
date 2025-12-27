import type { Recipe, RecipeDetail } from "../../../domain/recipe/recipe";
import type { Step } from "../../../domain/recipe/step";
import type { Result } from "../../../domain/shared/result";

export interface StepRepository {
  createSteps(recipe: Recipe, steps: Step[]): Promise<Result<void>>;
  deleteStepsForRecipe(recipe: Recipe): Promise<Result<void>>;
  getStepsForRecipe(recipe: Recipe): Promise<Result<Step[]>>;
}
