export interface Session {
  id: string;
  userId: number;
  secretHash: Uint8Array;
  createdAt: Date;
  lastVerifiedAt: Date;
}

export function isSessionExpired(
  session: Session,
  now: Date,
  timeoutMs: number,
): boolean {
  return now.getTime() - session.lastVerifiedAt.getTime() > timeoutMs;
}

export function needsActivityUpdate(
  session: Session,
  now: Date,
  thresholdMs: number,
): boolean {
  return now.getTime() - session.lastVerifiedAt.getTime() > thresholdMs;
}
