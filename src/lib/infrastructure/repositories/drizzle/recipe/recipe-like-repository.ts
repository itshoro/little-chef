import type { Connection } from "@/drizzle/db";
import { recipeLikes, recipes } from "@/drizzle/schema";
import type { RecipeLikeRepository } from "@/lib/application/abstractions/recipe/recipe-like-repository";
import type { Recipe } from "@/lib/domain/recipe/recipe";
import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";
import { and, eq, sql } from "drizzle-orm";

export class DrizzleRecipeLikeRepository implements RecipeLikeRepository {
  constructor(private readonly db: Connection) {}

  async hasUserLiked(recipe: Recipe, user: User): Promise<Result<boolean>> {
    try {
      const [result] = await this.db
        .select()
        .from(recipeLikes)
        .where(
          and(
            eq(recipeLikes.recipeId, recipe.id),
            eq(recipeLikes.userId, user.id),
          ),
        );

      if (!result) {
        return { ok: true, value: false };
      }

      return { ok: true, value: true };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to check if user liked recipe.", { cause: e }),
      };
    }
  }

  async likeRecipe(recipe: Recipe, user: User): Promise<Result<void>> {
    try {
      await this.db.transaction(async (tx) => {
        const likeResult = await tx
          .insert(recipeLikes)
          .values({ recipeId: recipe.id, userId: user.id })
          .onConflictDoNothing();

        if (likeResult.rowsAffected === 0) {
          throw new Error("User has already liked this recipe.");
        }

        const recipeResult = await tx
          .update(recipes)
          .set({ likes: sql`${recipes.likes} + 1` })
          .where(eq(recipes.id, recipe.id));

        if (recipeResult.rowsAffected === 0) {
          throw new Error("Recipe not found."); // Should be a noop.
        }
      });

      return { ok: true, value: undefined };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to like recipe.", { cause: e }),
      };
    }
  }

  async unlikeRecipe(recipe: Recipe, user: User): Promise<Result<void>> {
    try {
      await this.db.transaction(async (tx) => {
        const deleteResult = await tx
          .delete(recipeLikes)
          .where(
            and(
              eq(recipeLikes.recipeId, recipe.id),
              eq(recipeLikes.userId, user.id),
            ),
          );

        if (deleteResult.rowsAffected === 0) {
          throw new Error("User has not liked this recipe.");
        }

        const recipeResult = await tx
          .update(recipes)
          .set({ likes: sql`${recipes.likes} - 1` })
          .where(eq(recipes.id, recipe.id));

        if (recipeResult.rowsAffected === 0) {
          throw new Error("Recipe not found."); // Should be a noop.
        }
      });

      return { ok: true, value: undefined };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to unlike recipe.", { cause: e }),
      };
    }
  }
}
