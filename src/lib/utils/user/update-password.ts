import { makeUpdatePassword } from "@/lib/application/use-case/user/update-password";
import { db } from "@/drizzle/db";
import { Argon2IDPasswordHasher } from "@/lib/infrastructure/auth/argon2id-password-hasher";
import { StatefulSessionProvider } from "@/lib/infrastructure/auth/session/stateful/session-provider";
import { StatefulSessionTokenProvider } from "@/lib/infrastructure/auth/session/stateful/session-token-provider";
import { DrizzleSessionRepository } from "@/lib/infrastructure/repositories/drizzle/auth/session-repository";
import { DrizzleUserRepository } from "@/lib/infrastructure/repositories/drizzle/user/user-repository";

export async function updatePassword(
  ...args: Parameters<ReturnType<typeof makeUpdatePassword>>
): ReturnType<ReturnType<typeof makeUpdatePassword>> {
  try {
    return await db.transaction(async (tx) => {
      const passwordHasher = new Argon2IDPasswordHasher();
      const userRepository = new DrizzleUserRepository(tx);
      const sessionProvider = new StatefulSessionProvider(
        new StatefulSessionTokenProvider(),
        new DrizzleSessionRepository(tx),
      );

      const updatePassword = makeUpdatePassword(
        userRepository,
        passwordHasher,
        sessionProvider,
      );

      const result = await updatePassword(...args);
      if (!result.ok) {
        throw result.error;
      }
      return result;
    });
  } catch (e) {
    return { ok: false, error: e as Error };
  }
}
