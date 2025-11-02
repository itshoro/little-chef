import type { Result } from "@/lib/domain/shared/result";
import type { Recipe } from "../../../domain/recipe/recipe";
import type { User } from "../../../domain/user/user";

export interface RecipeLikeRepository {
  hasUserLiked(recipe: Recipe, userId: User): Promise<Result<boolean>>;
  likeRecipe(recipe: Recipe, userId: User): Promise<Result<void>>;
  unlikeRecipe(recipe: Recipe, userId: User): Promise<Result<void>>;
}
