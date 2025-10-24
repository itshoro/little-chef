"use server";

import { makeSignUpUser } from "@/lib/application/use-case/user/sign-up";
import { db } from "@/drizzle/db";
import { Argon2IDPasswordHasher } from "@/lib/infrastructure/auth/argon2id-password-hasher";
import { StatefulSessionProvider } from "@/lib/infrastructure/auth/session/stateful/session-provider";
import { StatefulSessionTokenProvider } from "@/lib/infrastructure/auth/session/stateful/session-token-provider";
import { DrizzleSessionRepository } from "@/lib/infrastructure/repositories/drizzle/auth/session-repository";
import { DrizzleAppPreferencesRepository } from "@/lib/infrastructure/repositories/drizzle/user/app-preferences-repository";
import { DrizzleCollectionPreferencesRepository } from "@/lib/infrastructure/repositories/drizzle/user/collection-preferences-repository";
import { DrizzleRecipePreferencesRepository } from "@/lib/infrastructure/repositories/drizzle/user/recipe-preferences-repository";
import { DrizzleUserRepository } from "@/lib/infrastructure/repositories/drizzle/user/user-repository";
import { isRateLimitedSignUp } from "@/lib/utils/rate-limit/auth";
import { signUpDTOFromFormData } from "@/lib/transformer/user/create-transformer";

async function signupAction(formData: FormData) {
  if (await isRateLimitedSignUp()) {
    throw new Error("Too many requests.");
  }

  const dto = signUpDTOFromFormData(formData);
  if (!dto.ok) throw dto.error;

  await db.transaction(async (tx) => {
    const signUpUser = makeSignUpUser(
      new DrizzleUserRepository(tx),
      new DrizzleAppPreferencesRepository(tx),
      new DrizzleCollectionPreferencesRepository(tx),
      new DrizzleRecipePreferencesRepository(tx),
      new StatefulSessionProvider(
        new StatefulSessionTokenProvider(),
        new DrizzleSessionRepository(tx),
      ),
      new Argon2IDPasswordHasher(),
    );

    await signUpUser(dto.value);
  });
}

export { signupAction };
