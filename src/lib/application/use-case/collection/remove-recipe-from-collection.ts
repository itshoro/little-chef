import type { CollectionPermissionRepository } from "@/lib/application/abstractions/collection/collection-permission-repository";
import type { CollectionRecipeRepository } from "@/lib/application/abstractions/collection/collection-recipe-repository";
import type { CollectionRepository } from "@/lib/application/abstractions/collection/collection-repository";
import type { RecipePermissionRepository } from "@/lib/application/abstractions/recipe/recipe-permission-repository";
import type { RecipeRepository } from "@/lib/application/abstractions/recipe/recipe-repository";
import type { Collection } from "@/lib/domain/collection/collection";
import type { Recipe } from "@/lib/domain/recipe/recipe";
import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";

export function makeRemoveRecipeFromCollection(
  collectionRepository: CollectionRepository,
  collectionRecipeRepository: CollectionRecipeRepository,
  collectionPermissionRepository: CollectionPermissionRepository,
  recipeRepository: RecipeRepository,
  recipePermissionRepository: RecipePermissionRepository,
) {
  return async function removeRecipeFromCollection(
    collectionIdentifier:
      | { id: Collection["id"] }
      | { publicId: Collection["publicId"] },
    recipeIdentifier:
      | { id: Recipe["id"] }
      | {
          publicId: Recipe["publicId"];
        },
    user: User,
  ): Promise<Result<void>> {
    const [collectionRes, recipeRes] = await Promise.all([
      "id" in collectionIdentifier
        ? collectionRepository.findById(collectionIdentifier.id)
        : collectionRepository.findByPublicId(collectionIdentifier.publicId),
      "id" in recipeIdentifier
        ? recipeRepository.findById(recipeIdentifier.id)
        : recipeRepository.findByPublicId(recipeIdentifier.publicId),
    ]);

    if (!collectionRes.ok) return collectionRes;
    if (!recipeRes.ok) return recipeRes;
    const collection = collectionRes.value;
    const recipe = recipeRes.value;

    const [canUpdateCollection, canViewRecipe] = await Promise.all([
      collectionPermissionRepository.canUpdate(collection, user),
      recipePermissionRepository.canView(recipe, user),
    ]);

    if (!canUpdateCollection.ok) return canUpdateCollection;
    if (!canViewRecipe.ok) return canViewRecipe;

    return await collectionRecipeRepository.removeRecipeFromCollection(
      collection,
      recipe,
    );
  };
}
