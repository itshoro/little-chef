import "server-only";

import type { SignInUserDTO } from "@/application/use-case/user/sign-in";
import type { SignUpUserDTO } from "@/application/use-case/user/sign-up";
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

export const SessionVerification = SignIn.extend(
  z.object({
    redirect: z.string().refine((val) => val.startsWith("/"), {
      message: "Redirect must be a relative path",
    }),
  }).shape,
);

export function verifySessionDTOFromFormData(
  redirect: string,
  formData: FormData,
): Result<z.infer<typeof SessionVerification>, Error> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const payload = SessionVerification.safeParse({
    username,
    password,
    redirect,
  });

  if (!payload.success) {
    return { ok: false, error: payload.error };
  }
  return {
    ok: true,
    value: payload.data,
  };
}
