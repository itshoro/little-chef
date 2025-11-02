import type { Collection } from "@/lib/domain/collection/collection";
import type { Recipe } from "@/lib/domain/recipe/recipe";
import type { Result } from "@/lib/domain/shared/result";

export interface CollectionRecipeRepository {
  addRecipeToCollection(
    collection: Collection,
    recipe: Recipe,
  ): Promise<Result<void>>;

  removeRecipeFromCollection(
    collection: Collection,
    recipe: Recipe,
  ): Promise<Result<void>>;

  findRecipesForCollection(
    collection: Collection,
  ): Promise<Result<Recipe[], Error>>;
}
