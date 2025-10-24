import type { Recipe } from "../../../domain/recipe/recipe";
import type { User } from "../../../domain/user/user";

export interface RecipeLikeRepository {
  hasUserLiked(recipe: Recipe, userId: User): Promise<boolean>;
  likeRecipe(recipe: Recipe, userId: User): Promise<boolean>;
  unlikeRecipe(recipe: Recipe, userId: User): Promise<boolean>;
}
