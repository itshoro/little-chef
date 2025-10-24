import {
  makeGetCollectionPreferences,
  makeGetRecipePreferences,
} from "@/lib/application/use-case/user/get-preferences";
import { db } from "@/drizzle/db";
import { DrizzleCollectionPreferencesRepository } from "@/lib/infrastructure/repositories/drizzle/user/collection-preferences-repository";
import { DrizzleRecipePreferencesRepository } from "@/lib/infrastructure/repositories/drizzle/user/recipe-preferences-repository";

export async function getCollectionPreferences(
  ...args: Parameters<ReturnType<typeof makeGetCollectionPreferences>>
) {
  const getPreferences = makeGetCollectionPreferences(
    new DrizzleCollectionPreferencesRepository(db),
  );

  return getPreferences(...args);
}

export async function getRecipePreferences(
  ...args: Parameters<ReturnType<typeof makeGetRecipePreferences>>
) {
  const getPreferences = makeGetRecipePreferences(
    new DrizzleRecipePreferencesRepository(db),
  );

  return getPreferences(...args);
}
