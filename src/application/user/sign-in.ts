import type { SessionProvider } from "@/domain/auth/session-provider";
import type { PasswordHasher } from "@/domain/user/password-hasher";
import type { UserRepository } from "@/domain/user/user-repository";
import { InvalidCredentialsError } from "@/lib/errors/invalid-credentials/error";
import type { LoginParams } from "../../domain/user/credentials";
import { createSession } from "../auth/create-session";

export async function signInUser(
  dto: LoginParams,
  now: Date,
  userRepository: UserRepository,
  sessionProvider: SessionProvider,
  passwordHasher: PasswordHasher,
) {
  const user = await userRepository.findByUsername(dto.username);

  if (!user) {
    throw new InvalidCredentialsError();
  }
  if (!passwordHasher.verify(dto.password, user.hashedPassword)) {
    throw new InvalidCredentialsError();
  }

  const session = await createSession(now, user.id, sessionProvider);
  return { user, session };
}
