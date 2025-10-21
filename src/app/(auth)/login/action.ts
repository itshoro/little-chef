"use server";

import { makeSignInUser } from "@/application/use-case/user/sign-in";
import { db } from "@/drizzle/db";
import { Argon2IDPasswordHasher } from "@/infrastructure/auth/argon2id-password-hasher";
import { StatefulSessionProvider } from "@/infrastructure/auth/session/stateful/session-provider";
import { StatefulSessionTokenProvider } from "@/infrastructure/auth/session/stateful/session-token-provider";
import { DrizzleSessionRepository } from "@/infrastructure/repositories/drizzle/auth/session-repository";
import { DrizzleUserRepository } from "@/infrastructure/repositories/drizzle/user/user-repository";
import { signInDTOFromFormData } from "@/transformer/user/create-transformer";

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

    const result = await signInUser(dto.value, new Date());
    if (!result.ok) throw result.error;
  });
}

export { loginAction };
