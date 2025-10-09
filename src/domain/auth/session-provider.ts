import { Session } from "./session";

export interface SessionProvider {
  getSession(): Promise<Session | null>;
  createSession(userId: number, now: Date): Promise<Session>;
  invalidateSession(sessionId: string): Promise<void>;
  updateLastVerifiedAt(sessionId: string, now: Date): Promise<void>;
}
