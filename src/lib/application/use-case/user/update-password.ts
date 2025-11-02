import type { PasswordHasher } from "@/lib/application/abstractions/auth/password-hasher";
import type { SessionProvider } from "@/lib/application/abstractions/auth/session-provider";
import type { UserRepository } from "@/lib/application/abstractions/user/user-repository";
import type { Result } from "@/lib/domain/shared/result";
import type { Password } from "@/lib/domain/user/credentials";
import type { User } from "@/lib/domain/user/user";

export function makeUpdatePassword(
  userRepository: UserRepository,
  passwordHasher: PasswordHasher,
  sessionProvider: SessionProvider,
) {
  return async function updatePassword(
    user: User,
    currentPassword: Password,
    password: Password,
  ): Promise<Result<void>> {
    const userKnowsPassword = await passwordHasher.verify(
      currentPassword,
      user.hashedPassword,
    );
    if (!userKnowsPassword.ok) return userKnowsPassword;

    const hashRes = await passwordHasher.hash(password);
    if (!hashRes.ok) return hashRes;

    const updateRes = await userRepository.update({
      ...user,
      hashedPassword: hashRes.value,
    });
    if (!updateRes.ok) return updateRes;

    await sessionProvider.invalidateAllSessionsForUser(user);
    const sessionResult = await sessionProvider.createSession(user, new Date());
    if (!sessionResult.ok) return sessionResult;

    return { ok: true, value: undefined };
  };
}
