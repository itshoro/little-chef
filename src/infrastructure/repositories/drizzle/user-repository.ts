import type { Username } from "@/domain/user/credentials";
import { User } from "@/domain/user/user";
import {
  UserRepository,
  type CreateUserParams,
} from "@/domain/user/user-repository";
import type { Connection } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { eq, type InferSelectModel } from "drizzle-orm";

function userFromDatabaseRow(row: InferSelectModel<typeof users>): User {
  return User.fromParams({
    avatar: row.avatar,
    hashedPassword: row.hashedPassword,
    id: row.id,
    publicId: row.publicId,
    username: row.username as Username, // assume stored usernames are valid
    appPreferencesId: row.appPreferencesId,
    collectionPreferencesId: row.collectionPreferencesId,
    recipePreferencesId: row.recipePreferencesId,
  });
}

export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly connection: Connection) {}

  async create(dto: CreateUserParams): Promise<User> {
    const [user] = await this.connection.insert(users).values(dto).returning();

    return userFromDatabaseRow(user);
  }

  async findById(id: number): Promise<User | null> {
    const [user] = await this.connection
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) return null;
    return userFromDatabaseRow(user);
  }

  async findByPublicId(id: string): Promise<User | null> {
    const [user] = await this.connection
      .select()
      .from(users)
      .where(eq(users.publicId, id))
      .limit(1);

    if (!user) return null;
    return userFromDatabaseRow(user);
  }

  async findByUsername(username: Username): Promise<User | null> {
    const [user] = await this.connection
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (!user) return null;
    return userFromDatabaseRow(user);
  }
}
