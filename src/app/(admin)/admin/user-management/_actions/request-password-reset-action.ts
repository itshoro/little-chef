"use server";

import { type DrizzleUser } from "@/drizzle/schema";
import { unsafeCreatePasswordResetRequest } from "@/lib/dal/session";

async function requestPasswordResetAction(
  userId: DrizzleUser["id"],
): Promise<string> {
  return unsafeCreatePasswordResetRequest(userId);
}

export { requestPasswordResetAction };
