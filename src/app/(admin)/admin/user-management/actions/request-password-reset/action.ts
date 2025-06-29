"use server";

import { type DrizzleUser } from "@/drizzle/schema";
import { requestPasswordReset } from "@/lib/auth";

async function requestPasswordResetAction(
  userId: DrizzleUser["id"],
): Promise<string> {
  return requestPasswordReset(userId);
}

export { requestPasswordResetAction };
