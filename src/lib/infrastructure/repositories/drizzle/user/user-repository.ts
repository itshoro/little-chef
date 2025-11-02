import type { Connection } from "@/drizzle/db";
import { fileReference, users } from "@/drizzle/schema";
import { UserRepository } from "@/lib/application/abstractions/user/user-repository";
import type { Result } from "@/lib/domain/shared/result";
import type { Username } from "@/lib/domain/user/credentials";
import { User } from "@/lib/domain/user/user";
import { eq, type InferSelectModel } from "drizzle-orm";

export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly connection: Connection) {}

  async create(user: Omit<User, "id">): Promise<Result<User>> {
    const result = await this.connection.insert(users).values(user);

    return { ok: true, value: { ...user, id: Number(result.lastInsertRowid) } };
  }

  async findById(id: number): Promise<Result<User>> {
    const [user] = await this.connection
      .select()
      .from(users)
      .where(eq(users.id, id))
      .leftJoin(fileReference, eq(fileReference.id, users.avatarId))
      .limit(1);

    if (!user) {
      return { ok: false, error: new Error("User not found") };
    }

    return {
      ok: true,
      value: this.fromParams(user),
    };
  }

  async findByPublicId(id: string): Promise<Result<User>> {
    const [user] = await this.connection
      .select()
      .from(users)
      .where(eq(users.publicId, id))
      .leftJoin(fileReference, eq(fileReference.id, users.avatarId))
      .limit(1);

    if (!user) {
      return { ok: false, error: new Error("User not found") };
    }

    return {
      ok: true,
      value: this.fromParams(user),
    };
  }

  async findByUsername(username: Username): Promise<Result<User>> {
    const [user] = await this.connection
      .select()
      .from(users)
      .where(eq(users.username, username))
      .leftJoin(fileReference, eq(fileReference.id, users.avatarId))
      .limit(1);

    if (!user) {
      return { ok: false, error: new Error("User not found") };
    }

    return {
      ok: true,
      value: this.fromParams(user),
    };
  }

  async update(user: User): Promise<Result<User>> {
    const dto: Omit<
      InferSelectModel<typeof users>,
      "createdAt" | "id" | "publicId"
    > = {
      username: user.username,
      avatarId: user.avatar ? Number(user.avatar.id) : null,
      hashedPassword: user.hashedPassword,
      appPreferencesId: user.appPreferencesId,
      collectionPreferencesId: user.collectionPreferencesId,
      recipePreferencesId: user.recipePreferencesId,
      updatedAt: new Date(),
      role: user.role,
    };

    const result = await this.connection
      .update(users)
      .set(dto)
      .where(eq(users.id, user.id));

    if (result.rowsAffected !== 1) {
      return { ok: false, error: new Error("Failed to update user") };
    }

    return { ok: true, value: user };
  }

  // MARK: utils

  fromParams(params: {
    users: InferSelectModel<typeof users>;
    file_references: InferSelectModel<typeof fileReference> | null;
  }): User {
    return {
      ...params.users,
      username: params.users.username as Username, // assume stored usernames are valid
      avatar: params.file_references,
    } satisfies User;
  }
}
