import { DEFAULT_APP_PREFERENCES } from "@/lib/domain/user/app-preferences";
import type { AppPreferencesRepository } from "@/lib/domain/user/app-preferences-repository";
import { DEFAULT_COLLECTION_PREFERENCES } from "@/lib/domain/user/collection-preferences";
import type { CollectionPreferencesRepository } from "@/lib/domain/user/collection-preferences-repository";
import type { Password, Username } from "@/lib/domain/user/credentials";
import type { PasswordHasher } from "@/lib/domain/user/password-hasher";
import { DEFAULT_RECIPE_PREFERENCES } from "@/lib/domain/user/recipe-preferences";
import type { RecipePreferencesRepository } from "@/lib/domain/user/recipe-preferences-repository";
import type { UserRepository } from "@/lib/domain/user/user-repository";
import { nanoid } from "@/lib/nanoid";

export interface CreateUserDTO {
  username: Username;
  password: Password;
}

export function makeCreateUser(
  userRepository: UserRepository,
  passwordHasher: PasswordHasher,
  appPreferencesRepository: AppPreferencesRepository,
  recipePreferencesRepository: RecipePreferencesRepository,
  collectionPreferencesRepository: CollectionPreferencesRepository,
) {
  return async function createUser(dto: CreateUserDTO) {
    const [appPreferences, recipePreferences, collectionPreferences] =
      await Promise.all([
        appPreferencesRepository.create(DEFAULT_APP_PREFERENCES),
        recipePreferencesRepository.create(DEFAULT_RECIPE_PREFERENCES),
        collectionPreferencesRepository.create(DEFAULT_COLLECTION_PREFERENCES),
      ]);

    return await userRepository.create({
      ...dto,
      publicId: nanoid(),
      avatar: null,
      hashedPassword: await passwordHasher.hash(dto.password),
      appPreferencesId: appPreferences.id,
      collectionPreferencesId: collectionPreferences.id,
      recipePreferencesId: recipePreferences.id,
      role: "user",
    });
  };
}
