import type { SessionProvider } from "@/application/abstractions/auth/session-provider";
import type { Session } from "@/domain/auth/session";
import type { Result } from "@/domain/shared/result";
import type { Password, Username } from "@/domain/user/credentials";
import type { PasswordHasher } from "@/domain/user/password-hasher";
import type { User } from "@/domain/user/user";
import type { UserRepository } from "@/domain/user/user-repository";
import { makeCreateSession } from "../use-case/auth/create-session";

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

    const user = await userRepository.findByUsername(dto.username);
    if (!user) {
      return { ok: false, error: new Error("User does not exist.") };
    }
    if (!passwordHasher.verify(dto.password, user.hashedPassword)) {
      return { ok: false, error: new Error("Password wrong.") };
    }

    const session = await createSession(now, user);
    return { ok: true, value: { user, session } };
  };
}
