"use server";

import { makeSignInUser } from "@/application/user/sign-in";
import { db } from "@/drizzle/db";
import { Argon2IDPasswordHasher } from "@/infrastructure/auth/argon2id-password-hasher";
import { StatefulSessionProvider } from "@/infrastructure/auth/session/stateful/session-provider";
import { StatefulSessionTokenProvider } from "@/infrastructure/auth/session/stateful/session-token-provider";
import { DrizzleSessionRepository } from "@/infrastructure/repositories/drizzle/auth/session-repository";
import { DrizzleUserRepository } from "@/infrastructure/repositories/drizzle/user/user-repository";
import { isRateLimitedLogin } from "@/lib/services/rate-limit/auth";
import { loginSchema } from "@/lib/validators/auth";
import { signInDTOFromFormData } from "@/transformer/user/create-transformer";
import { cookies } from "next/headers";

export type LoginFormData = {
  username: string;
  password?: string;
};

async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (await isRateLimitedLogin()) {
    throw new Error("Too many requests.");
  }

  const parseResult = loginSchema.safeParse({ username, password });
  if (!parseResult.success) {
    throw new Error(undefined, {
      cause: parseResult.error.flatten().fieldErrors,
    });
  }
}

async function loginAction(formData: FormData) {
  const dto = signInDTOFromFormData(formData);
  if (!dto.ok) throw dto.error;

  await db.transaction(async (tx) => {
    const signInUser = makeSignInUser(
      new DrizzleUserRepository(tx),
      new StatefulSessionProvider(
        new StatefulSessionTokenProvider(),
        new DrizzleSessionRepository(tx),
      ),
      new Argon2IDPasswordHasher(),
    );

    await signInUser(dto.value, new Date());
  });
}

export { loginAction };
