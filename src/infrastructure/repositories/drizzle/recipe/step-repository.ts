import type { Recipe } from "@/domain/recipe/recipe";
import type { Step } from "@/domain/recipe/step";
import type { StepRepository } from "@/application/abstractions/recipe/step-repository";
import type { Result } from "@/domain/shared/result";
import type { Connection } from "@/drizzle/db";
import { recipeSteps } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export class DrizzleStepRepository implements StepRepository {
  constructor(private readonly db: Connection) {}

  async createSteps(
    recipeId: Recipe["id"],
    steps: Step[],
  ): Promise<Result<void, Error>> {
    await this.db.insert(recipeSteps).values(
      steps.map((step) => ({
        recipeId,
        ...step,
      })),
    );

    return { ok: true, value: undefined };
  }

  async getStepsForRecipe(
    recipeId: Recipe["id"],
  ): Promise<Result<Step[], Error>> {
    const rows = await this.db
      .select()
      .from(recipeSteps)
      .where(eq(recipeSteps.recipeId, recipeId))
      .orderBy(recipeSteps.order);

    const steps: Step[] = rows.map((row) => ({
      order: row.order,
      description: row.description,
    }));

    return { ok: true, value: steps };
  }

  async deleteStepsForRecipe(
    recipeId: Recipe["id"],
  ): Promise<Result<void, Error>> {
    await this.db.delete(recipeSteps).where(eq(recipeSteps.recipeId, recipeId));

    return { ok: true, value: undefined };
  }
}
