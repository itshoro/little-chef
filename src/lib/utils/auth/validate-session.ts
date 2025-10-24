import { validateSession as _validateSession } from "@/lib/application/use-case/auth/validate-session";
import { db } from "@/drizzle/db";
import { StatefulSessionProvider } from "@/lib/infrastructure/auth/session/stateful/session-provider";
import { StatefulSessionTokenProvider } from "@/lib/infrastructure/auth/session/stateful/session-token-provider";
import { DrizzleSessionRepository } from "@/lib/infrastructure/repositories/drizzle/auth/session-repository";
import { DrizzleUserRepository } from "@/lib/infrastructure/repositories/drizzle/user/user-repository";

export async function validateSession() {
  const userRepository = new DrizzleUserRepository(db);
  const sessionRepository = new DrizzleSessionRepository(db);
  const sessionProvider = new StatefulSessionProvider(
    new StatefulSessionTokenProvider(),
    sessionRepository,
  );

  return await _validateSession(new Date(), sessionProvider, userRepository);
}
