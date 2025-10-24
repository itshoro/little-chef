import type { PasswordResetRepository } from "@/application/abstractions/auth/password-reset-repository";
import type { SessionProvider } from "@/application/abstractions/auth/session-provider";
import type { Session } from "@/domain/auth/session";
import type { Result } from "@/domain/shared/result";
import type { Password } from "@/domain/user/credentials";
import type { PasswordHasher } from "@/domain/user/password-hasher";
import type { User } from "@/domain/user/user";
import type { UserRepository } from "@/domain/user/user-repository";

export function makeResetPassword(
  passwordResetRepository: PasswordResetRepository,
  sessionProvider: SessionProvider,
  userRepository: UserRepository,
  passwordHasher: PasswordHasher,
) {
  return async function resetPassword(
    token: string,
    newPassword: Password,
  ): Promise<Result<{ session: Session; user: User }, Error>> {
    const userResult = await passwordResetRepository.validateResetToken(token);
    if (!userResult.ok) return userResult;

    let user = userResult.value;

    await sessionProvider.invalidateAllSessionsForUser(user);

    user.hashedPassword = await passwordHasher.hash(newPassword);
    const updateResult = await userRepository.update(user);
    if (!updateResult.ok) return updateResult;
    user = updateResult.value;

    const session = await sessionProvider.createSession(user, new Date());

    return { ok: true, value: { user, session } };
  };
}
