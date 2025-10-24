"use server";

import { db } from "@/drizzle/db";
import { passwordResetRequests, type DrizzleUser } from "@/drizzle/schema";

async function requestPasswordResetAction(
  userId: DrizzleUser["id"],
): Promise<string> {
  // todo: hard-coded instead of using use-case as this will most likely be refactored soon.

  const token = crypto.randomUUID();

  await db.insert(passwordResetRequests).values({
    userId,
    token,
    expiresAt: new Date(Date.now() + 1000 * 60 * 15),
  });

  return `/reset-password?token=${token}`;
}

export { requestPasswordResetAction };
