import type { StepRepository } from "@/lib/application/abstractions/recipe/step-repository";
import type { Recipe, RecipeDetail } from "@/lib/domain/recipe/recipe";
import type { Step } from "@/lib/domain/recipe/step";
import type { Result } from "@/lib/domain/shared/result";
import type { Connection } from "@/drizzle/db";
import { recipeSteps } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export class DrizzleStepRepository implements StepRepository {
  constructor(private readonly db: Connection) {}

  async createSteps(
    recipe: Recipe,
    steps: Step[],
  ): Promise<Result<RecipeDetail, Error>> {
    await this.db.insert(recipeSteps).values(
      steps.map((step) => ({
        recipeId: recipe.id,
        ...step,
      })),
    );

    return { ok: true, value: { ...recipe, steps } };
  }

  async getStepsForRecipe(recipe: Recipe): Promise<Result<Step[], Error>> {
    const rows = await this.db
      .select()
      .from(recipeSteps)
      .where(eq(recipeSteps.recipeId, recipe.id))
      .orderBy(recipeSteps.order);

    const steps: Step[] = rows.map((row) => ({
      order: row.order,
      description: row.description,
    }));

    return { ok: true, value: steps };
  }

  async deleteStepsForRecipe(
    recipe: Recipe,
  ): Promise<Result<RecipeDetail, Error>> {
    await this.db
      .delete(recipeSteps)
      .where(eq(recipeSteps.recipeId, recipe.id));

    return { ok: true, value: { ...recipe, steps: [] } };
  }
}
