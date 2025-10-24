import type { PasswordResetRequest } from "@/lib/domain/auth/password-reset-request";
import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";

export interface PasswordResetRepository {
  generateResetToken(
    resetRequest: Omit<PasswordResetRequest, "id">,
  ): Promise<Result<PasswordResetRequest, Error>>;
  validateResetToken(token: string): Promise<Result<User, Error>>;
}
