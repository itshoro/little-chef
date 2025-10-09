import type { SessionProvider } from "@/domain/auth/session-provider";

export async function createSession(
  now: Date,
  userId: number,
  sessionProvider: SessionProvider,
) {
  const session = await sessionProvider.createSession(userId, now);

  return session;
}
