import type { Connection } from "@/drizzle/db";
import { recipeSteps } from "@/drizzle/schema";
import type { StepRepository } from "@/lib/application/abstractions/recipe/step-repository";
import type { Recipe, RecipeDetail } from "@/lib/domain/recipe/recipe";
import type { Step } from "@/lib/domain/recipe/step";
import type { Result } from "@/lib/domain/shared/result";
import { eq } from "drizzle-orm";

export class DrizzleStepRepository implements StepRepository {
  constructor(private readonly db: Connection) {}

  async createSteps(recipe: Recipe, steps: Step[]): Promise<Result<void>> {
    try {
      await this.db.insert(recipeSteps).values(
        steps.map((step) => ({
          recipeId: recipe.id,
          ...step,
        })),
      );

      return { ok: true, value: undefined };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to create steps.", { cause: e }),
      };
    }
  }

  async getStepsForRecipe(recipe: Recipe): Promise<Result<Step[], Error>> {
    try {
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
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to get steps for recipe.", { cause: e }),
      };
    }
  }

  async deleteStepsForRecipe(recipe: Recipe): Promise<Result<void>> {
    try {
      await this.db
        .delete(recipeSteps)
        .where(eq(recipeSteps.recipeId, recipe.id));

      return { ok: true, value: undefined };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to delete steps for recipe.", { cause: e }),
      };
    }
  }
}
