import type { PasswordHasher } from "@/lib/application/abstractions/auth/password-hasher";
import type { PasswordResetRepository } from "@/lib/application/abstractions/auth/password-reset-repository";
import type { SessionProvider } from "@/lib/application/abstractions/auth/session-provider";
import type { UserRepository } from "@/lib/application/abstractions/user/user-repository";
import type { Result } from "@/lib/domain/shared/result";
import type { Password } from "@/lib/domain/user/credentials";

export function makeResetPassword(
  passwordResetRepository: PasswordResetRepository,
  sessionProvider: SessionProvider,
  userRepository: UserRepository,
  passwordHasher: PasswordHasher,
) {
  return async function resetPassword(
    token: string,
    newPassword: Password,
  ): Promise<Result<undefined>> {
    const userResult = await passwordResetRepository.validateResetToken(token);
    if (!userResult.ok) return userResult;

    const user = userResult.value;
    const invalidationRes =
      await sessionProvider.invalidateAllSessionsForUser(user);
    if (!invalidationRes.ok) return invalidationRes;

    const hashRes = await passwordHasher.hash(newPassword);

    if (!hashRes.ok) return hashRes;
    user.hashedPassword = hashRes.value;

    const updateRes = await userRepository.update(user);
    if (!updateRes.ok) return updateRes;

    const sessionRes = await sessionProvider.createSession(user, new Date());
    if (!sessionRes.ok) return sessionRes;

    return { ok: true, value: undefined };
  };
}
