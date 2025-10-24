import { db } from "@/drizzle/db";
import { DrizzleSessionRepository } from "@/lib/infrastructure/repositories/drizzle/auth/session-repository";
import { UnauthenticatedError } from "@/lib/errors/unauthenticated/error";
import {
  redirectToSignIn,
  requireSession,
} from "@/lib/utils/auth/require-session";
import { verifySessionDTOFromFormData } from "@/lib/transformer/user/create-transformer";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { z } from "zod";

async function verifyAction(redirectUrl: string, formData: FormData) {
  "use server";
  const { session } = await requireSession({
    onUnauthenticated: () => {
      throw new UnauthenticatedError();
    },
  });

  const dto = verifySessionDTOFromFormData(redirectUrl, formData);
  if (!dto.ok) throw dto.error;

  const repo = new DrizzleSessionRepository(db);
  await repo.updateLastVerifiedAt(session.id, new Date());

  redirect(redirectUrl as Route);
}

export { verifyAction };
