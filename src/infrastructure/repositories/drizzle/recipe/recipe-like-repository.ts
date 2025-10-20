import type { Recipe } from "@/domain/recipe/recipe";
import type { RecipeLikeRepository } from "@/application/abstractions/recipe/recipe-like-repository";
import type { User } from "@/domain/user/user";
import type { Connection } from "@/drizzle/db";
import { recipeLikes, recipes } from "@/drizzle/schema";
import { and, eq, sql } from "drizzle-orm";

export class DrizzleRecipeLikeRepository implements RecipeLikeRepository {
  constructor(private readonly db: Connection) {}

  async hasUserLiked(recipe: Recipe, user: User): Promise<boolean> {
    const [result] = await this.db
      .select()
      .from(recipeLikes)
      .where(
        and(
          eq(recipeLikes.recipeId, recipe.id),
          eq(recipeLikes.userId, user.id),
        ),
      );

    return result !== undefined;
  }

  async likeRecipe(recipe: Recipe, user: User): Promise<boolean> {
    return await this.db.transaction(async (tx) => {
      const result = await tx
        .insert(recipeLikes)
        .values({ recipeId: recipe.id, userId: user.id })
        .onConflictDoNothing();

      // todo: verify rowsAffected works as expected with onConflictDoNothing
      if (result.rowsAffected > 0) {
        await tx
          .update(recipes)
          .set({ likes: sql`${recipes.likes} + 1` })
          .where(eq(recipes.id, recipe.id));

        return true;
      }
      return false;
    });
  }

  async unlikeRecipe(recipe: Recipe, user: User): Promise<boolean> {
    return await this.db.transaction(async (tx) => {
      const result = await tx
        .delete(recipeLikes)
        .where(
          and(
            eq(recipeLikes.recipeId, recipe.id),
            eq(recipeLikes.userId, user.id),
          ),
        );

      // todo: verify rowsAffected works as expected with onConflictDoNothing
      if (result.rowsAffected > 0) {
        await tx
          .update(recipes)
          .set({ likes: sql`${recipes.likes} - 1` })
          .where(eq(recipes.id, recipe.id));

        return true;
      }
      return false;
    });
  }
}
