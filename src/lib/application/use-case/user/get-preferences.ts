import type { CollectionPreferencesRepository } from "@/lib/application/abstractions/user/collection-preferences-repository";
import type { RecipePreferencesRepository } from "@/lib/application/abstractions/user/recipe-preferences-repository";
import type { User } from "@/lib/domain/user/user";

export function makeGetCollectionPreferences(
  collectionPreferencesRepository: CollectionPreferencesRepository,
) {
  return async function getCollectionPreferences(user: User) {
    const preferences = await collectionPreferencesRepository.findByUserId(
      user.id,
    );

    return preferences;
  };
}

export function makeGetRecipePreferences(
  recipePreferencesRepository: RecipePreferencesRepository,
) {
  return async function getRecipePreferences(user: User) {
    const preferences = await recipePreferencesRepository.findByUserId(user.id);

    return preferences;
  };
}
