import type { SessionProvider } from "@/lib/application/abstractions/auth/session-provider";
import type { Session } from "@/lib/domain/auth/session";
import type { Result } from "@/lib/domain/shared/result";
import type { AppPreferencesRepository } from "@/lib/application/abstractions/user/app-preferences-repository";
import type { CollectionPreferencesRepository } from "@/lib/application/abstractions/user/collection-preferences-repository";
import type { PasswordHasher } from "@/lib/application/abstractions/auth/password-hasher";
import type { RecipePreferencesRepository } from "@/lib/application/abstractions/user/recipe-preferences-repository";
import type { User } from "@/lib/domain/user/user";
import type { UserRepository } from "@/lib/application/abstractions/user/user-repository";
import { taintObjectReference } from "next/dist/server/app-render/entry-base";
import { makeCreateSession } from "../auth/create-session";
import { makeCreateUser, type CreateUserDTO } from "./create-user";

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
    if (existingUser.ok) {
      return { ok: false, error: new Error("User already exists.") };
    }

    const userRes = await createUser(dto);
    if (!userRes.ok) return userRes;

    const sessionRes = await createSession(now, userRes.value);
    if (!sessionRes.ok) return sessionRes;

    taintObjectReference(
      "sessions may not be passed over the network boundary",
      sessionRes,
    );

    return {
      ok: true,
      value: { user: userRes.value, session: sessionRes.value },
    };
  };
}
