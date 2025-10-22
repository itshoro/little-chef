import type { Collection } from "@/domain/collection/collection";
import type { Recipe } from "@/domain/recipe/recipe";
import type { Result } from "@/domain/shared/result";

export interface CollectionRecipeRepository {
  addRecipeToCollection(
    collection: Collection,
    recipe: Recipe,
  ): Promise<Result<void, Error>>;

  removeRecipeFromCollection(
    collection: Collection,
    recipe: Recipe,
  ): Promise<Result<void, Error>>;

  findRecipesForCollection(
    collection: Collection,
  ): Promise<Result<Recipe[], Error>>;
}
