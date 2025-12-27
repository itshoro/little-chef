import { DEFAULT_APP_PREFERENCES } from "@/lib/domain/user/app-preferences";
import type { AppPreferencesRepository } from "@/lib/application/abstractions/user/app-preferences-repository";
import { DEFAULT_COLLECTION_PREFERENCES } from "@/lib/domain/user/collection-preferences";
import type { CollectionPreferencesRepository } from "@/lib/application/abstractions/user/collection-preferences-repository";
import type { Password, Username } from "@/lib/domain/user/credentials";
import type { PasswordHasher } from "@/lib/application/abstractions/auth/password-hasher";
import { DEFAULT_RECIPE_PREFERENCES } from "@/lib/domain/user/recipe-preferences";
import type { RecipePreferencesRepository } from "@/lib/application/abstractions/user/recipe-preferences-repository";
import type { UserRepository } from "@/lib/application/abstractions/user/user-repository";
import { nanoid } from "@/lib/nanoid";
import { taintObjectReference } from "next/dist/server/app-render/entry-base";
import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";

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
  return async function createUser(dto: CreateUserDTO): Promise<Result<User>> {
    const [appPreferences, recipePreferences, collectionPreferences] =
      await Promise.all([
        appPreferencesRepository.create(DEFAULT_APP_PREFERENCES),
        recipePreferencesRepository.create(DEFAULT_RECIPE_PREFERENCES),
        collectionPreferencesRepository.create(DEFAULT_COLLECTION_PREFERENCES),
      ]);

    if (!appPreferences.ok) return appPreferences;
    if (!recipePreferences.ok) return recipePreferences;
    if (!collectionPreferences.ok) return collectionPreferences;

    const hashResult = await passwordHasher.hash(dto.password);
    if (!hashResult.ok) return hashResult;

    const result = await userRepository.create({
      ...dto,
      publicId: nanoid(),
      avatar: null,
      hashedPassword: hashResult.value,
      appPreferencesId: appPreferences.value.id,
      collectionPreferencesId: collectionPreferences.value.id,
      recipePreferencesId: recipePreferences.value.id,
      role: "user",
    });

    if (!result.ok) return result;

    taintObjectReference(
      "users may not be passed over the network boundary, consider calling `toPublicUser` first",
      result.value,
    );

    return result;
  };
}
