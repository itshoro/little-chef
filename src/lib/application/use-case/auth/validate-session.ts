import type { SessionProvider } from "@/lib/application/abstractions/auth/session-provider";
import type { UserRepository } from "@/lib/application/abstractions/user/user-repository";
import {
  isSessionExpired,
  needsActivityUpdate,
} from "@/lib/domain/auth/session";
import {
  ACTIVITY_UPDATE_INTERVAL_MS,
  INACTIVITY_TIMEOUT_MS,
} from "@/lib/infrastructure/auth/session/stateful/session-provider";
import { taintObjectReference } from "next/dist/server/app-render/entry-base";

export function makeValidateSession(
  sessionProvider: SessionProvider,
  userRepository: UserRepository,
) {
  return async function validateSession(now: Date) {
    const sessionRes = await sessionProvider.getSession();
    if (!sessionRes.ok) {
      return { user: null, session: null };
    }
    const session = sessionRes.value;

    if (isSessionExpired(session, now, INACTIVITY_TIMEOUT_MS)) {
      await sessionProvider.invalidateSession(session.id);
      return { user: null, session: null };
    }

    if (needsActivityUpdate(session, now, ACTIVITY_UPDATE_INTERVAL_MS)) {
      session.lastVerifiedAt = now;
      const updateRes = await sessionProvider.updateLastVerifiedAt(
        session.id,
        now,
      );
      if (!updateRes.ok) {
        return { user: null, session: null };
      }
    }

    const userRes = await userRepository.findById(session.userId);
    if (!userRes.ok) {
      // this should never happen, but if it does, invalidate the session
      await sessionProvider.invalidateSession(session.id);
      return { user: null, session: null };
    }
    const user = userRes.value;

    taintObjectReference(
      "sessions may not be passed over the network boundary",
      session,
    );
    taintObjectReference(
      "users may not be passed over the network boundary, consider calling `toPublicUser` first",
      user,
    );

    return { user, session };
  };
}
