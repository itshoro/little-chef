import type { SessionProvider } from "@/lib/application/abstractions/auth/session-provider";
import type { Session } from "@/lib/domain/auth/session";

export function makeSignOutUser(SessionProvider: SessionProvider) {
  return async function signOutUser(session: Session) {
    return await SessionProvider.invalidateSession(session.id);
  };
}
