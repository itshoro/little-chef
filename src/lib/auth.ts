import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "../drizzle/db";
import {
  sessions,
  sessionScopes,
  users,
  type Session,
  type SessionScope,
  type User,
} from "../drizzle/schema";
import { cookies } from "next/headers";

const sessionCookieName = "session";

export const supportedSessionScopes = ["sudo"] as const;

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(token: string, userId: number) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const [session] = await db
    .insert(sessions)
    .values({
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    })
    .returning();

  return session;
}

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await db
    .select({ user: users, session: sessions })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId));

  if (result.length < 1) {
    return { session: null, user: null };
  }

  const { user, session } = result[0];
  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessions).where(eq(sessions.id, session.id));
    return { session: null, user: null };
  }

  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db
      .update(sessions)
      .set({
        expiresAt: session.expiresAt,
      })
      .where(eq(sessions.id, session.id));
  }
  return { session, user };
}

export async function invalidateSession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function invalidateAllSessions(userId: number) {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

export async function setSessionTokenCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function validateRequest(): Promise<SessionValidationResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName);

  if (!token) {
    return { session: null, user: null };
  }

  return validateSessionToken(token.value);
}

export async function assertAuthorizedForServerAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName);

  if (!token) {
    throw new Error("Unauthorized");
  }

  const { session, user } = await validateSessionToken(token.value);

  if (!session) {
    cookieStore.delete(sessionCookieName);
    throw new Error("Unauthorized");
  }

  return { session, user };
}

export async function addSessionScopes(
  session: Session,
  scopes: SessionScope["scope"][],
): Promise<void> {
  if (scopes.length < 1) return;

  // remove requested scopes from the session inserting them again mimics an upsert
  await db
    .delete(sessionScopes)
    .where(
      and(
        eq(sessionScopes.sessionId, session.id),
        inArray(sessionScopes.scope, scopes),
      ),
    );

  await db.insert(sessionScopes).values(
    scopes.map((scope) => ({
      sessionId: session.id,
      scope,
      // todo: make this configurable
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    })),
  );
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
