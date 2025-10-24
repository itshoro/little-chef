import type { SessionProvider } from "@/lib/application/abstractions/auth/session-provider";
import type { Password } from "@/lib/domain/user/credentials";
import type { PasswordHasher } from "@/lib/domain/user/password-hasher";
import type { User } from "@/lib/domain/user/user";
import type { UserRepository } from "@/lib/domain/user/user-repository";

export function makeUpdatePassword(
  userRepository: UserRepository,
  passwordHasher: PasswordHasher,
  sessionProvider: SessionProvider,
) {
  return async function updatePassword(user: User, password: Password) {
    const userKnowsPassword = await passwordHasher.verify(
      password,
      user.hashedPassword,
    );

    if (!userKnowsPassword) {
      return { ok: false, error: "Current password is incorrect." };
    }

    const result = await userRepository.update({
      ...user,
      hashedPassword: await passwordHasher.hash(password),
    });
    if (!result.ok) return result;

    await sessionProvider.invalidateAllSessionsForUser(user);
    const sessionResult = await sessionProvider.createSession(user, new Date());

    return { ok: true, data: sessionResult };
  };
}
