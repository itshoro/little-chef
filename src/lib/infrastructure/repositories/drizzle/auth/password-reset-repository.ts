import type { Connection } from "@/drizzle/db";
import { fileReference, passwordResetRequests, users } from "@/drizzle/schema";
import type { PasswordResetRepository } from "@/lib/application/abstractions/auth/password-reset-repository";
import type { PasswordResetRequest } from "@/lib/domain/auth/password-reset-request";
import type { Result } from "@/lib/domain/shared/result";
import type { Username } from "@/lib/domain/user/credentials";
import type { User } from "@/lib/domain/user/user";
import { eq } from "drizzle-orm";

export class DrizzlePasswordResetRepository implements PasswordResetRepository {
  constructor(private readonly db: Connection) {}

  async createPasswordResetRequest(
    resetRequest: PasswordResetRequest,
  ): Promise<Result<PasswordResetRequest>> {
    try {
      const row = await this.db.insert(passwordResetRequests).values({
        userId: resetRequest.user.id,
        token: resetRequest.token,
        createdAt: resetRequest.createdAt,
        expiresAt: resetRequest.expiresAt,
      });

      const request: PasswordResetRequest = {
        ...resetRequest,
        id: Number(row.lastInsertRowid),
      };

      return { ok: true, value: request };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to generate password reset request.", {
          cause: e,
        }),
      };
    }
  }

  async validateResetToken(token: string): Promise<Result<User>> {
    try {
      const [resetRequest] = await this.db
        .select()
        .from(passwordResetRequests)
        .innerJoin(users, eq(passwordResetRequests.userId, users.id))
        .leftJoin(fileReference, eq(fileReference.id, users.avatarId))
        .where(eq(passwordResetRequests.token, token));

      if (!resetRequest) {
        return {
          ok: false,
          error: new Error(
            "Could not find reset request matching the provided token.",
          ),
        };
      }

      return {
        ok: true,
        value: {
          ...resetRequest.users,
          username: resetRequest.users.username as Username,
          avatar: resetRequest.file_references,
        },
      };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to validate password reset token.", {
          cause: e,
        }),
      };
    }
  }
}
