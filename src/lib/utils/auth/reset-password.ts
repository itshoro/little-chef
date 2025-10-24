import { makeResetPassword } from "@/application/use-case/user/reset-password";
import { db } from "@/drizzle/db";
import { Argon2IDPasswordHasher } from "@/infrastructure/auth/argon2id-password-hasher";
import { StatefulSessionProvider } from "@/infrastructure/auth/session/stateful/session-provider";
import { StatefulSessionTokenProvider } from "@/infrastructure/auth/session/stateful/session-token-provider";
import { DrizzlePasswordResetRepository } from "@/infrastructure/repositories/drizzle/auth/password-reset-repository";
import { DrizzleSessionRepository } from "@/infrastructure/repositories/drizzle/auth/session-repository";
import { DrizzleUserRepository } from "@/infrastructure/repositories/drizzle/user/user-repository";

export async function resetPassword(
  ...args: Parameters<ReturnType<typeof makeResetPassword>>
): ReturnType<ReturnType<typeof makeResetPassword>> {
  try {
    return db.transaction(async (tx) => {
      const resetPassword = makeResetPassword(
        new DrizzlePasswordResetRepository(tx),
        new StatefulSessionProvider(
          new StatefulSessionTokenProvider(),
          new DrizzleSessionRepository(tx),
        ),
        new DrizzleUserRepository(tx),
        new Argon2IDPasswordHasher(),
      );

      const result = await resetPassword(...args);
      if (!result.ok) throw result.error;

      return result;
    });
  } catch (e) {
    return { ok: false, error: e as Error };
  }
}
