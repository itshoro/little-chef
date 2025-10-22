import type { SessionProvider } from "@/application/abstractions/auth/session-provider";
import type { Session } from "@/domain/auth/session";

export function makeSignOutUser(SessionProvider: SessionProvider) {
  return async function signOutUser(session: Session) {
    await SessionProvider.invalidateSession(session.id);
  };
}
