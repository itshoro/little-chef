import type { CollectionPermissionRepository } from "@/application/abstractions/collection/collection-permission-repository";
import type { CollectionRecipeRepository } from "@/application/abstractions/collection/collection-recipe-repository";
import type { CollectionRepository } from "@/application/abstractions/collection/collection-repository";
import type { RecipePermissionRepository } from "@/application/abstractions/recipe/recipe-permission-repository";
import type { Collection } from "@/domain/collection/collection";
import type { Recipe } from "@/domain/recipe/recipe";
import type { Result } from "@/domain/shared/result";
import type { User } from "@/domain/user/user";

export function makeRemoveRecipeFromCollection(
  collectionRepository: CollectionRepository,
  collectionRecipeRepository: CollectionRecipeRepository,
  collectionPermissionRepository: CollectionPermissionRepository,
  recipePermissionRepository: RecipePermissionRepository,
) {
  return async function removeRecipeFromCollection(
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
      // todo: consider whether this check is necessary when removing
      return { ok: false, error: new Error("User cannot view recipe") };
    }

    return await collectionRecipeRepository.removeRecipeFromCollection(
      collection,
      recipe,
    );
  };
}
