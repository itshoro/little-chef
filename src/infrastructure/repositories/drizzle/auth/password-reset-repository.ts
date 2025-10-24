import type { PasswordResetRepository } from "@/application/abstractions/auth/password-reset-repository";
import type { PasswordResetRequest } from "@/domain/auth/password-reset-request";
import type { Result } from "@/domain/shared/result";
import type { Username } from "@/domain/user/credentials";
import type { User } from "@/domain/user/user";
import type { Connection } from "@/drizzle/db";
import { fileReference, passwordResetRequests, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export class DrizzlePasswordResetRepository implements PasswordResetRepository {
  constructor(private readonly db: Connection) {}

  async generateResetToken(
    resetRequest: PasswordResetRequest,
  ): Promise<Result<PasswordResetRequest, Error>> {
    const result = await this.db.insert(passwordResetRequests).values({
      userId: resetRequest.user.id,
      token: resetRequest.token,
      createdAt: resetRequest.createdAt,
      expiresAt: resetRequest.expiresAt,
    });

    const request = {
      ...resetRequest,
      id: Number(result.lastInsertRowid),
    };

    return { ok: true, value: request };
  }

  async validateResetToken(token: string): Promise<Result<User, Error>> {
    const [resetRequest] = await this.db
      .select()
      .from(passwordResetRequests)
      .innerJoin(users, eq(passwordResetRequests.userId, users.id))
      .leftJoin(fileReference, eq(fileReference.id, users.avatarId))
      .where(eq(passwordResetRequests.token, token));

    if (!resetRequest) {
      return { ok: false, error: new Error("Invalid password reset token.") };
    }

    return {
      ok: true,
      value: {
        ...resetRequest.users,
        username: resetRequest.users.username as Username,
        avatar: resetRequest.file_references,
      },
    };
  }
}
