import type { PasswordResetRequest } from "@/domain/auth/password-reset-request";
import type { Result } from "@/domain/shared/result";
import type { User } from "@/domain/user/user";

export interface PasswordResetRepository {
  generateResetToken(
    resetRequest: Omit<PasswordResetRequest, "id">,
  ): Promise<Result<PasswordResetRequest, Error>>;
  validateResetToken(token: string): Promise<Result<User, Error>>;
}
