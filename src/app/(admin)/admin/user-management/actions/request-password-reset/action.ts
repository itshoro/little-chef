"use server";

import { type User } from "@/drizzle/schema";
import { requestPasswordReset } from "@/lib/auth";

async function requestPasswordResetAction(userId: User["id"]): Promise<string> {
  return requestPasswordReset(userId);
}

export { requestPasswordResetAction };
