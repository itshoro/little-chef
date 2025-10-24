import { db } from "@/drizzle/db";
import { makeHasResetPasswordRequest } from "@/lib/application/use-case/user/has-reset-password-request";
import { DrizzlePasswordResetRepository } from "@/lib/infrastructure/repositories/drizzle/auth/password-reset-repository";

export async function passwordResetRequestExists(
  token: string,
): Promise<boolean> {
  const passwordResetExists = makeHasResetPasswordRequest(
    new DrizzlePasswordResetRepository(db),
  );

  return passwordResetExists(token);
}
