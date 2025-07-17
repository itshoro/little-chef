import { db, type Connection } from "@/drizzle/db";
import {
  passwordResetRequests,
  sessions,
  sessionScopes,
  users,
  type DrizzleSession,
  type DrizzleSessionInsert,
  type DrizzleSessionScope,
  type DrizzleUser,
  type IdentifiedById,
  type SessionIdentifier,
} from "@/drizzle/schema";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { and, eq, gt, sql } from "drizzle-orm";

export async function unsafeCreateSession(
  connection: Connection,
  dto: DrizzleSessionInsert,
) {
  const [session] = await connection.insert(sessions).values(dto).returning();

  return session;
}

export async function unsafeUpdateSessionExpiresAt(
  connection: Connection,
  identifier: SessionIdentifier,
  newExpiresAt: Date,
) {
  await connection
    .update(sessions)
    .set({ expiresAt: newExpiresAt })
    .where(eq(sessions.id, identifier.id));
}

export async function unsafeDeleteSession(
  connection: Connection,
  identifier: SessionIdentifier,
) {
  await connection.delete(sessions).where(eq(sessions.id, identifier.id));
}

export async function unsafeDeleteAllSessionsForUser(
  connection: Connection,
  identifier: IdentifiedById<DrizzleUser>,
) {
  await connection.delete(sessions).where(eq(sessions.userId, identifier.id));
}

export async function unsafeGetSessionByIdentifier(
  identifier: SessionIdentifier,
) {
  const [session] = await db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.id, identifier.id),
        gt(sessions.expiresAt, sql`(unixepoch())`),
      ),
    )
    .limit(1);
  return session ?? null;
}

export async function unsafeGetSessionAndUserByToken(
  token: string,
): Promise<{ session: DrizzleSession; user: DrizzleUser } | null> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const [result] = await db
    .select({ user: users, session: sessions })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId));

  return result ?? null;
}

export async function unsafeInvalidateSession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function unsafeInvalidateAllSessions(
  connection: Connection,
  userId: number,
) {
  await connection.delete(sessions).where(eq(sessions.userId, userId));
}

export async function unsafeAddSessionScopes(
  session: DrizzleSession,
  scopes: DrizzleSessionScope["scope"][],
): Promise<void> {
  // todo: make this configurable
  await db
    .insert(sessionScopes)
    .values(
      scopes.map((scope) => ({
        sessionId: session.id,
        scope,
        expiresAt: sql`(unixepoch() + 3600 * 24 * 30)`, // 30 days
      })),
    )
    .onConflictDoUpdate({
      target: [sessionScopes.sessionId, sessionScopes.scope],
      set: {
        sessionId: session.id,
        scope: sql.raw(`excluded.${sessionScopes.scope.name}`),
        expiresAt: sql`(unixepoch() + 3600 * 24 * 30)`, // 30 days
      },
    });
}

export async function unsafeGetPasswordResetRequest(
  token: string,
): Promise<{ userId: DrizzleUser["id"]; expiresAt: Date } | null> {
  const [resetRequest] = await db
    .select()
    .from(passwordResetRequests)
    .where(eq(passwordResetRequests.token, token))
    .limit(1);

  if (Date.now() >= resetRequest.expiresAt.getTime()) {
    await db
      .delete(passwordResetRequests)
      .where(eq(passwordResetRequests.id, resetRequest.id));
    return null;
  }

  return resetRequest;
}

export async function unsafeCreatePasswordResetRequest(
  userId: DrizzleUser["id"],
) {
  const [resetRequest] = await db
    .insert(passwordResetRequests)
    .values({
      userId,
      expiresAt: sql`(unixepoch() + 3600)`, // 1 hour
      token: crypto.randomUUID(),
    })
    .returning();

  return resetRequest.token;
}

export async function unsafeGetSessionScopes(session: SessionIdentifier) {
  return await db
    .select()
    .from(sessionScopes)
    .where(
      and(
        eq(sessionScopes.sessionId, session.id),
        gt(sessionScopes.expiresAt, sql`(unixepoch())`),
      ),
    );
}
