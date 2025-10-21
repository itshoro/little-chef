import type { User } from "@/domain/user/user";
import { Session } from "../../../domain/auth/session";

export interface SessionProvider {
  getSession(): Promise<Session | null>;
  createSession(user: User, now: Date): Promise<Session>;
  invalidateSession(sessionId: string): Promise<void>;
  invalidateAllSessionsForUser(user: User): Promise<void>;
  updateLastVerifiedAt(sessionId: string, now: Date): Promise<void>;
}
