import type { CollectionPermissionRepository } from "@/lib/application/abstractions/collection/collection-permission-repository";
import type { CollectionRecipeRepository } from "@/lib/application/abstractions/collection/collection-recipe-repository";
import type { CollectionRepository } from "@/lib/application/abstractions/collection/collection-repository";
import type { RecipePermissionRepository } from "@/lib/application/abstractions/recipe/recipe-permission-repository";
import type { Collection } from "@/lib/domain/collection/collection";
import type { Recipe } from "@/lib/domain/recipe/recipe";
import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";

export function makeAddRecipeToCollection(
  collectionRepository: CollectionRepository,
  collectionRecipeRepository: CollectionRecipeRepository,
  collectionPermissionRepository: CollectionPermissionRepository,
  recipePermissionRepository: RecipePermissionRepository,
) {
  return async function addRecipeToCollection(
    collectionIdentifier:
      | { id: Collection["id"] }
      | { publicId: Collection["publicId"] },
    recipe: Recipe,
    user: User,
  ): Promise<Result<void, Error>> {
    const collection =
      "id" in collectionIdentifier
        ? await collectionRepository.findById(collectionIdentifier.id)
        : await collectionRepository.findByPublicId(
            collectionIdentifier.publicId,
          );
    if (!collection) {
      return { ok: false, error: new Error("Collection not found") };
    }

    const [canUpdateCollection, canViewRecipe] = await Promise.all([
      collectionPermissionRepository.canUpdate(collection, user),
      recipePermissionRepository.canView(recipe, user),
    ]);

    if (!canUpdateCollection) {
      return { ok: false, error: new Error("User cannot update collection") };
    }
    if (!canViewRecipe) {
      return { ok: false, error: new Error("User cannot view recipe") };
    }

    return await collectionRecipeRepository.addRecipeToCollection(
      collection,
      recipe,
    );
  };
}
