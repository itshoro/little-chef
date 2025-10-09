import type { SessionProvider } from "@/domain/auth/session-provider";
import type { AppPreferencesRepository } from "@/domain/user/app-preferences-repository";
import type { CollectionPreferencesRepository } from "@/domain/user/collection-preferences-repository";
import type { PasswordHasher } from "@/domain/user/password-hasher";
import type { RecipePreferencesRepository } from "@/domain/user/recipe-preferences-repository";
import type { CreateUserParams } from "@/domain/user/user";
import type { UserRepository } from "@/domain/user/user-repository";
import { ConflictError } from "@/lib/errors/conflict/error";
import type { Password } from "../../domain/user/credentials";
import { createSession } from "../auth/create-session";
import { createUser } from "./create-user";

interface SignUpUserParams
  extends Omit<
    CreateUserParams,
    | "id"
    | "hashedPassword"
    | "appPreferencesId"
    | "collectionPreferencesId"
    | "recipePreferencesId"
  > {
  password: Password;
}

export const SESSION_COOKIE_NAME = "session";

export async function signUpUser(
  dto: SignUpUserParams,
  userRepository: UserRepository,
  appPreferencesRepository: AppPreferencesRepository,
  collectionPreferencesRepository: CollectionPreferencesRepository,
  recipePreferencesRepository: RecipePreferencesRepository,
  sessionProvider: SessionProvider,
  passwordHasher: PasswordHasher,
) {
  const now = new Date();

  const existingUser = await userRepository.findByUsername(dto.username);
  if (existingUser) {
    throw new ConflictError("The username is already taken.");
  }

  const { password, ...rest } = dto;
  const hashedPassword = await passwordHasher.hash(password);

  const user = await createUser(
    { ...rest, hashedPassword },
    userRepository,
    appPreferencesRepository,
    recipePreferencesRepository,
    collectionPreferencesRepository,
  );

  const session = await createSession(now, user.id, sessionProvider);

  return { user, session };
}
