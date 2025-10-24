import {
  isSessionExpired,
  needsActivityUpdate,
} from "@/lib/domain/auth/session";
import type { SessionProvider } from "@/lib/application/abstractions/auth/session-provider";
import type { UserRepository } from "@/lib/domain/user/user-repository";
import {
  ACTIVITY_UPDATE_INTERVAL_MS,
  INACTIVITY_TIMEOUT_MS,
} from "@/lib/infrastructure/auth/session/stateful/session-provider";

export async function validateSession(
  now: Date,
  sessionProvider: SessionProvider,
  userRepository: UserRepository,
) {
  const session = await sessionProvider.getSession();
  if (!session) {
    return { user: null, session: null };
  }

  if (isSessionExpired(session, now, INACTIVITY_TIMEOUT_MS)) {
    await sessionProvider.invalidateSession(session.id);
    return { user: null, session: null };
  }

  if (needsActivityUpdate(session, now, ACTIVITY_UPDATE_INTERVAL_MS)) {
    session.lastVerifiedAt = now;
    await sessionProvider.updateLastVerifiedAt(session.id, now);
  }

  const user = await userRepository.findById(session.userId);
  if (!user) {
    // this should never happen, but if it does, invalidate the session
    await sessionProvider.invalidateSession(session.id);
    return { user: null, session: null };
  }

  return { user, session };
}
