"use server";

import { db } from "@/drizzle/db";
import { makeSignInUser } from "@/lib/application/use-case/user/sign-in";
import { Argon2IDPasswordHasher } from "@/lib/infrastructure/auth/argon2id-password-hasher";
import { StatefulSessionProvider } from "@/lib/infrastructure/auth/session/stateful/session-provider";
import { StatefulSessionTokenProvider } from "@/lib/infrastructure/auth/session/stateful/session-token-provider";
import { DrizzleSessionRepository } from "@/lib/infrastructure/repositories/drizzle/auth/session-repository";
import { DrizzleUserRepository } from "@/lib/infrastructure/repositories/drizzle/user/user-repository";
import { signInDTOFromFormData } from "@/lib/transformer/user/create-transformer";

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
