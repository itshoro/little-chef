import type { Connection } from "@/drizzle/db";
import { recipeHistories } from "@/drizzle/schema";
import type { ResourceHistoryRepository } from "@/lib/application/abstractions/user/history-repository";
import type { Recipe } from "@/lib/domain/recipe/recipe";
import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";
import { sql } from "drizzle-orm";

export class DrizzleRecipeHistoryRepository implements ResourceHistoryRepository<Recipe> {
  constructor(private readonly db: Connection) {}

  async upsertRecord(recipe: Recipe, user: User): Promise<Result<void>> {
    try {
      await this.db
        .insert(recipeHistories)
        .values({
          recipeId: recipe.id,
          userId: user.id,
        })
        .onConflictDoUpdate({
          set: {
            createdAt: sql`(unixepoch())`,
          },
          target: [recipeHistories.recipeId, recipeHistories.userId],
        });

      return { ok: true, value: undefined };
    } catch (error) {
      return {
        ok: false,
        error: new Error("Unable to upsert record", { cause: error }),
      };
    }
  }
}
