import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";
import { Session } from "../../../domain/auth/session";

export interface SessionProvider {
  getSession(): Promise<Result<Session>>;
  createSession(user: User, now: Date): Promise<Result<Session>>;
  invalidateSession(sessionId: string): Promise<Result<void>>;
  invalidateAllSessionsForUser(user: User): Promise<Result<void>>;
  updateLastVerifiedAt(sessionId: string, now: Date): Promise<Result<void>>;
}
