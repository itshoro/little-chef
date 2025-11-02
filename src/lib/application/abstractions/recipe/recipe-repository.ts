import type { Recipe } from "../../../domain/recipe/recipe";
import type { RecipeCreationError } from "../../../domain/recipe/recipe-creation-error";
import type { RecipeUpdateError } from "../../../domain/recipe/recipe-update-error";
import type { Result } from "../../../domain/shared/result";

export interface RecipeRepository {
  create(
    params: Omit<Recipe, "id" | "collaborators">,
  ): Promise<Result<Recipe, RecipeCreationError>>;
  findById(id: number): Promise<Result<Recipe>>;
  findByPublicId(publicId: string): Promise<Result<Recipe>>;
  update(
    recipe: Omit<Recipe, "collaborators">,
  ): Promise<Result<Recipe, RecipeUpdateError>>;
  delete(recipe: Recipe): Promise<Result<void>>;
}
