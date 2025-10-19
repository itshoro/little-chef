import type { Result } from "../../../domain/shared/result";
import type { User } from "../../../domain/user/user";
import type {
  RecipeInsert as InternalCreateRecipeParams,
  Recipe,
} from "../../../domain/recipe/recipe";
import type { RecipeCreationError } from "../../domain/recipe/recipe-creation-error";
import type { RecipeUpdateError } from "../../../domain/recipe/recipe-update-error";

export type CreateRecipeParams = Omit<InternalCreateRecipeParams, "id">;
export type UpdateRecipeParams = Omit<CreateRecipeParams, "publicId"> & {
  publicId?: never;
};

export interface RecipeRepository {
  create(
    params: Omit<Recipe, "id">,
  ): Promise<Result<Recipe, RecipeCreationError>>;
  findById(id: number): Promise<Recipe | null>;
  findByPublicId(publicId: string): Promise<Recipe | null>;
  update(
    id: number,
    recipe: Omit<Recipe, "id" | "publicId" | "likes">,
  ): Promise<Result<Recipe, RecipeUpdateError>>;
  delete(id: number): Promise<void>;
}
