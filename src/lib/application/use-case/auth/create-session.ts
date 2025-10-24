import type { SessionProvider } from "@/lib/application/abstractions/auth/session-provider";
import type { User } from "@/lib/domain/user/user";

export function makeCreateSession(sessionProvider: SessionProvider) {
  return async function createSession(now: Date, user: User) {
    const session = await sessionProvider.createSession(user, now);

    return session;
  };
}
