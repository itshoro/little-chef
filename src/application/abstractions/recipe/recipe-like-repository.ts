import type { User } from "../../../domain/user/user";
import type { Recipe } from "../../../domain/recipe/recipe";

export interface RecipeLikeRepository {
  hasUserLiked(recipeId: Recipe["id"], userId: User["id"]): Promise<boolean>;
  likeRecipe(recipeId: Recipe["id"], userId: User["id"]): Promise<boolean>;
  unlikeRecipe(recipeId: Recipe["id"], userId: User["id"]): Promise<boolean>;
}
