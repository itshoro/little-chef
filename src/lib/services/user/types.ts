import type {
  DrizzleCollectionPreferencesInsert,
  DrizzleRecipePreferencesInsert,
  DrizzleUser,
  DrizzleUserInsert,
} from "@/drizzle/schema";
import type { Password, Username } from "@/lib/validators/user";
type CollectionPreferencesInsertDTO = Omit<
  DrizzleCollectionPreferencesInsert,
  "id"
>;
type CollectionPreferencesUpdateDTO = Omit<
  DrizzleCollectionPreferencesInsert,
  "id"
>;

type RecipePreferencesInsertDTO = Omit<DrizzleRecipePreferencesInsert, "id">;
type RecipePreferencesUpdateDTO = Omit<DrizzleRecipePreferencesInsert, "id">;

type UserUpdateDTO = Partial<
  Omit<
    DrizzleUserInsert,
    | "id"
    | "hashedPassword"
    | "appPreferencesId"
    | "recipePreferencesId"
    | "collectionPreferencesId"
  > & {
    username: Username;
    password: Password;
  }
>;

type UserOutputPublicDTO = Omit<
  DrizzleUser,
  | "id"
  | "hashedPassword"
  | "hashedPassword"
  | "appPreferencesId"
  | "recipePreferencesId"
  | "collectionPreferencesId"
>;

export type {
  CollectionPreferencesInsertDTO,
  CollectionPreferencesUpdateDTO,
  RecipePreferencesInsertDTO,
  RecipePreferencesUpdateDTO,
  UserInsertDTO,
  UserOutputPublicDTO,
  UserUpdateDTO,
};
