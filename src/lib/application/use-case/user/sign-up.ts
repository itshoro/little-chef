import type { SessionProvider } from "@/lib/application/abstractions/auth/session-provider";
import type { Session } from "@/lib/domain/auth/session";
import type { Result } from "@/lib/domain/shared/result";
import type { AppPreferencesRepository } from "@/lib/domain/user/app-preferences-repository";
import type { CollectionPreferencesRepository } from "@/lib/domain/user/collection-preferences-repository";
import type { PasswordHasher } from "@/lib/domain/user/password-hasher";
import type { RecipePreferencesRepository } from "@/lib/domain/user/recipe-preferences-repository";
import type { User } from "@/lib/domain/user/user";
import type { UserRepository } from "@/lib/domain/user/user-repository";
import { makeCreateSession } from "../auth/create-session";
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
    if (!user.ok) return user;
    const session = await createSession(now, user.value);

    return { ok: true, value: { user: user.value, session } };
  };
}
