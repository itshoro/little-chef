import "server-only";

import type { SignInUserDTO } from "@/application/user/sign-in";
import type { SignUpUserDTO } from "@/application/user/sign-up";
import type { Result } from "@/domain/shared/result";
import { passwordSchema, usernameSchema } from "@/domain/user/credentials";
import * as z from "zod/v4";

const SignUp = z
  .object({
    username: usernameSchema,
    password: passwordSchema,
    confirmationPassword: passwordSchema,
    inviteCode: z.string(),
  })
  .refine((data) => data.password === data.confirmationPassword, {
    message: "Passwords must match.",
    path: ["confirmation-password"],
  })
  .refine((data) => data.inviteCode === process.env.INVITE_CODE, {
    message: "The entered invite code is invalid.",
  });

const SignIn = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export function signUpDTOFromFormData(
  formData: FormData,
): Result<SignUpUserDTO, Error> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const confirmationPassword = formData.get("confirmation-password") as string;
  const inviteCode = formData.get("invite-code") as string;

  const payload = SignUp.safeParse({
    username,
    password,
    confirmationPassword,
    inviteCode,
  });
  if (!payload.success) {
    return { ok: false, error: payload.error };
  }

  return {
    ok: true,
    value: {
      username: payload.data.username,
      password: payload.data.password,
    },
  };
}

export function signInDTOFromFormData(
  formData: FormData,
): Result<SignInUserDTO, Error> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const payload = SignIn.safeParse({
    username,
    password,
  });
  if (!payload.success) {
    return { ok: false, error: payload.error };
  }

  return {
    ok: true,
    value: {
      username: payload.data.username,
      password: payload.data.password,
    },
  };
}
