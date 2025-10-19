import { validateSession as _validateSession } from "@/application/use-case/auth/validate-session";
import { db } from "@/drizzle/db";
import { StatefulSessionProvider } from "@/infrastructure/auth/session/stateful/session-provider";
import { StatefulSessionTokenProvider } from "@/infrastructure/auth/session/stateful/session-token-provider";
import { DrizzleSessionRepository } from "@/infrastructure/repositories/drizzle/auth/session-repository";
import { DrizzleUserRepository } from "@/infrastructure/repositories/drizzle/user/user-repository";

export async function validateSession() {
  const userRepository = new DrizzleUserRepository(db);
  const sessionRepository = new DrizzleSessionRepository(db);
  const sessionProvider = new StatefulSessionProvider(
    new StatefulSessionTokenProvider(),
    sessionRepository,
  );

  return await _validateSession(new Date(), sessionProvider, userRepository);
}
