import type { Connection } from "@/drizzle/db";
import { sessions } from "@/drizzle/schema";
import type { SessionRepository } from "@/lib/application/abstractions/auth/session-repository";
import type { Session } from "@/lib/domain/auth/session";
import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";
import { eq, type InferSelectModel } from "drizzle-orm";

function sessionFromDatabaseRow(
  row: InferSelectModel<typeof sessions>,
): Session {
  return {
    id: row.id,
    secretHash: row.secretHash as Uint8Array,
    userId: row.userId,
    createdAt: row.createdAt,
    lastVerifiedAt: row.lastVerifiedAt,
  } satisfies Session;
}

export class DrizzleSessionRepository implements SessionRepository {
  constructor(private readonly connection: Connection) {}

  async create(dto: Session): Promise<Result<Session>> {
    try {
      const [row] = await this.connection
        .insert(sessions)
        .values(dto)
        .returning();

      if (!row) {
        return {
          ok: false,
          error: new Error("Failed to create session."),
        };
      }

      return { ok: true, value: sessionFromDatabaseRow(row) };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to create session.", { cause: e }),
      };
    }
  }

  async findById(id: string): Promise<Result<Session>> {
    try {
      const [session] = await this.connection
        .select()
        .from(sessions)
        .where(eq(sessions.id, id))
        .limit(1);

      if (!session) {
        return { ok: false, error: new Error("Session not found.") };
      }

      return { ok: true, value: sessionFromDatabaseRow(session) };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Session not found.", { cause: e }),
      };
    }
  }

  async updateLastVerifiedAt(id: string, date: Date): Promise<Result<void>> {
    try {
      const result = await this.connection
        .update(sessions)
        .set({ lastVerifiedAt: date })
        .where(eq(sessions.id, id));

      if (result.rowsAffected === 0) {
        return { ok: false, error: new Error("Session not found.") };
      }

      return { ok: true, value: undefined };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to update session.", { cause: e }),
      };
    }
  }

  async deleteById(id: string): Promise<Result<void>> {
    try {
      const result = await this.connection
        .delete(sessions)
        .where(eq(sessions.id, id));

      if (result.rowsAffected === 0) {
        return { ok: false, error: new Error("Session not found.") };
      }

      return { ok: true, value: undefined };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to delete session.", { cause: e }),
      };
    }
  }

  async deleteByUser(user: User): Promise<Result<void>> {
    try {
      const result = await this.connection
        .delete(sessions)
        .where(eq(sessions.userId, user.id));

      if (result.rowsAffected === 0) {
        return { ok: false, error: new Error("Session not found.") };
      }

      return { ok: true, value: undefined };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to delete sessions for user.", { cause: e }),
      };
    }
  }
}
