import type { SignInUserDTO } from "@/lib/application/use-case/user/sign-in";
import type { SignUpUserDTO } from "@/lib/application/use-case/user/sign-up";
import type { Result } from "@/lib/domain/shared/result";
import { passwordSchema, usernameSchema } from "@/lib/domain/user/credentials";
import * as z from "zod/mini";

const SignUpServer = z.object({
  username: usernameSchema,
  password: passwordSchema,
  inviteCode: z
    .string()
    .check(z.refine((val) => val === process.env.INVITE_CODE)),
});

export const signInSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export function signUpDTOFromFormData(
  formData: FormData,
): Result<SignUpUserDTO> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const confirmationPassword = formData.get("confirmation-password") as string;
  const inviteCode = formData.get("invite-code") as string;

  const payload = SignUpServer.safeParse({
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
): Result<SignInUserDTO> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const payload = signInSchema.safeParse({
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

const SessionVerification = z.extend(
  signInSchema,
  z.object({
    redirect: z.string().check(z.refine((val) => val.startsWith("/"))),
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
