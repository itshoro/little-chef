import type { SessionProvider } from "@/application/abstractions/auth/session-provider";
import type { User } from "@/domain/user/user";

export function makeCreateSession(sessionProvider: SessionProvider) {
  return async function createSession(now: Date, user: User) {
    const session = await sessionProvider.createSession(user, now);

    return session;
  };
}
