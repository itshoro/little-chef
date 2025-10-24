"use server";

import { makeSignUpUser } from "@/application/use-case/user/sign-up";
import { db } from "@/drizzle/db";
import { Argon2IDPasswordHasher } from "@/infrastructure/auth/argon2id-password-hasher";
import { StatefulSessionProvider } from "@/infrastructure/auth/session/stateful/session-provider";
import { StatefulSessionTokenProvider } from "@/infrastructure/auth/session/stateful/session-token-provider";
import { DrizzleSessionRepository } from "@/infrastructure/repositories/drizzle/auth/session-repository";
import { DrizzleAppPreferencesRepository } from "@/infrastructure/repositories/drizzle/user/app-preferences-repository";
import { DrizzleCollectionPreferencesRepository } from "@/infrastructure/repositories/drizzle/user/collection-preferences-repository";
import { DrizzleRecipePreferencesRepository } from "@/infrastructure/repositories/drizzle/user/recipe-preferences-repository";
import { DrizzleUserRepository } from "@/infrastructure/repositories/drizzle/user/user-repository";
import { isRateLimitedSignUp } from "@/lib/utils/rate-limit/auth";
import { signUpDTOFromFormData } from "@/transformer/user/create-transformer";

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
