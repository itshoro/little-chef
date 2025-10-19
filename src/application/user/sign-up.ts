import type { SessionProvider } from "@/application/abstractions/auth/session-provider";
import type { Session } from "@/domain/auth/session";
import type { Result } from "@/domain/shared/result";
import type { AppPreferencesRepository } from "@/domain/user/app-preferences-repository";
import type { CollectionPreferencesRepository } from "@/domain/user/collection-preferences-repository";
import type { PasswordHasher } from "@/domain/user/password-hasher";
import type { RecipePreferencesRepository } from "@/domain/user/recipe-preferences-repository";
import type { User } from "@/domain/user/user";
import type { UserRepository } from "@/domain/user/user-repository";
import { makeCreateSession } from "../use-case/auth/create-session";
import { makeCreateUser, type CreateUserDTO } from "./create-user";

export const SESSION_COOKIE_NAME = "session";

export type SignUpUserDTO = CreateUserDTO;

export function makeSignUpUser(
  userRepository: UserRepository,
  appPreferencesRepository: AppPreferencesRepository,
  collectionPreferencesRepository: CollectionPreferencesRepository,
  recipePreferencesRepository: RecipePreferencesRepository,
  sessionProvider: SessionProvider,
  passwordHasher: PasswordHasher,
) {
  return async function signUpUser(
    dto: SignUpUserDTO,
  ): Promise<Result<{ user: User; session: Session }, Error>> {
    const now = new Date();

    const createUser = makeCreateUser(
      userRepository,
      passwordHasher,
      appPreferencesRepository,
      recipePreferencesRepository,
      collectionPreferencesRepository,
    );
    const createSession = makeCreateSession(sessionProvider);

    const existingUser = await userRepository.findByUsername(dto.username);
    if (existingUser) {
      return { ok: false, error: new Error("User already exists.") };
    }

    const user = await createUser(dto);
    const session = await createSession(now, user);

    return { ok: true, value: { user, session } };
  };
}
