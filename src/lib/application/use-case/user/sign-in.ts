import type { SessionProvider } from "@/lib/application/abstractions/auth/session-provider";
import type { Session } from "@/lib/domain/auth/session";
import type { Result } from "@/lib/domain/shared/result";
import type { Password, Username } from "@/lib/domain/user/credentials";
import type { PasswordHasher } from "@/lib/application/abstractions/auth/password-hasher";
import type { User } from "@/lib/domain/user/user";
import type { UserRepository } from "@/lib/application/abstractions/user/user-repository";
import { taintObjectReference } from "next/dist/server/app-render/entry-base";
import { makeCreateSession } from "../auth/create-session";

export interface SignInUserDTO {
  username: Username;
  password: Password;
}

export function makeSignInUser(
  userRepository: UserRepository,
  sessionProvider: SessionProvider,
  passwordHasher: PasswordHasher,
) {
  return async function signInUser(
    dto: SignInUserDTO,
    now: Date,
  ): Promise<Result<{ user: User; session: Session }, Error>> {
    const createSession = makeCreateSession(sessionProvider);

    const userRes = await userRepository.findByUsername(dto.username);

    if (!userRes.ok) {
      return { ok: false, error: new Error("User does not exist.") };
    }
    const user = userRes.value;

    const verificationRes = await passwordHasher.verify(
      dto.password,
      user.hashedPassword,
    );
    if (!verificationRes.ok) return verificationRes;

    const sessionRes = await createSession(now, user);

    if (!sessionRes.ok) return sessionRes;
    const session = sessionRes.value;

    taintObjectReference(
      "sessions may not be passed over the network boundary",
      session,
    );
    taintObjectReference(
      "users may not be passed over the network boundary, consider calling `toPublicUser` first",
      user,
    );

    return { ok: true, value: { user, session } };
  };
}
