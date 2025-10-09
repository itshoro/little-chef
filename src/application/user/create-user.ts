import { DEFAULT_APP_PREFERENCES } from "@/domain/user/app-preferences";
import type { AppPreferencesRepository } from "@/domain/user/app-preferences-repository";
import { DEFAULT_COLLECTION_PREFERENCES } from "@/domain/user/collection-preferences";
import type { CollectionPreferencesRepository } from "@/domain/user/collection-preferences-repository";
import { DEFAULT_RECIPE_PREFERENCES } from "@/domain/user/recipe-preferences";
import type { RecipePreferencesRepository } from "@/domain/user/recipe-preferences-repository";
import type {
  CreateUserParams,
  UserRepository,
} from "@/domain/user/user-repository";

export async function createUser(
  dto: Omit<
    CreateUserParams,
    "appPreferencesId" | "collectionPreferencesId" | "recipePreferencesId"
  >,
  userRepository: UserRepository,
  appPreferencesRepository: AppPreferencesRepository,
  recipePreferencesRepository: RecipePreferencesRepository,
  collectionPreferencesRepository: CollectionPreferencesRepository,
) {
  const [appPreferences, recipePreferences, collectionPreferences] =
    await Promise.all([
      appPreferencesRepository.create(DEFAULT_APP_PREFERENCES),
      recipePreferencesRepository.create(DEFAULT_RECIPE_PREFERENCES),
      collectionPreferencesRepository.create(DEFAULT_COLLECTION_PREFERENCES),
    ]);

  return await userRepository.create({
    ...dto,
    appPreferencesId: appPreferences.id,
    collectionPreferencesId: collectionPreferences.id,
    recipePreferencesId: recipePreferences.id,
  });
}
