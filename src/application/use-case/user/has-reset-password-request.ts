import type { PasswordResetRepository } from "@/application/abstractions/auth/password-reset-repository";

export function makeHasResetPasswordRequest(
  resetRepository: PasswordResetRepository,
) {
  return async function hasResetPasswordRequest(token: string) {
    const result = await resetRepository.validateResetToken(token);
    return result.ok;
  };
}
