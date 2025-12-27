import type { SessionProvider } from "@/lib/application/abstractions/auth/session-provider";
import type { Session } from "@/lib/domain/auth/session";
import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";

export function makeCreateSession(sessionProvider: SessionProvider) {
  return async function createSession(
    now: Date,
    user: User,
  ): Promise<Result<Session>> {
    return await sessionProvider.createSession(user, now);
  };
}
