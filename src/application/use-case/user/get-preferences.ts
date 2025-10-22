import type { CollectionPreferencesRepository } from "@/domain/user/collection-preferences-repository";
import type { RecipePreferencesRepository } from "@/domain/user/recipe-preferences-repository";
import type { User } from "@/domain/user/user";

export function makeGetCollectionPreferences(
  collectionPreferencesRepository: CollectionPreferencesRepository,
) {
  return async function getCollectionPreferences(user: User) {
    const preferences = await collectionPreferencesRepository.findById(
      user.collectionPreferencesId,
    );

    return preferences;
  };
}

export function makeGetRecipePreferences(
  recipePreferencesRepository: RecipePreferencesRepository,
) {
  return async function getRecipePreferences(user: User) {
    const preferences = await recipePreferencesRepository.findById(
      user.recipePreferencesId,
    );

    return preferences;
  };
}
