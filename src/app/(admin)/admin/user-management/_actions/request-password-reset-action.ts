"use server";

import { db } from "@/drizzle/db";
import { passwordResetRequests } from "@/drizzle/schema";
import type { User } from "@/lib/domain/user/user";

async function requestPasswordResetAction(userId: User["id"]): Promise<string> {
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
