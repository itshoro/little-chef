import type { Connection } from "@/drizzle/db";
import { sessions } from "@/drizzle/schema";
import type { SessionRepository } from "@/lib/application/abstractions/auth/session-repository";
import type { Session } from "@/lib/domain/auth/session";
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

  async create(dto: Session): Promise<Session> {
    const [session] = await this.connection
      .insert(sessions)
      .values(dto)
      .returning();

    return sessionFromDatabaseRow(session);
  }

  async findById(id: string): Promise<Session | null> {
    const [session] = await this.connection
      .select()
      .from(sessions)
      .where(eq(sessions.id, id))
      .limit(1);

    if (!session) return null;

    return sessionFromDatabaseRow(session);
  }

  async updateLastVerifiedAt(id: string, date: Date): Promise<void> {
    await this.connection
      .update(sessions)
      .set({ lastVerifiedAt: date })
      .where(eq(sessions.id, id));
  }

  async deleteById(id: string): Promise<void> {
    await this.connection.delete(sessions).where(eq(sessions.id, id));
  }

  async deleteByUser(user: User): Promise<void> {
    await this.connection.delete(sessions).where(eq(sessions.userId, user.id));
  }
}
