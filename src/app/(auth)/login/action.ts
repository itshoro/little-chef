import type { FormState } from "@/app/components/form/root";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/auth";
import { findUserByCredentials } from "@/lib/dal/user";
import { passwordSchema, usernameSchema } from "@/lib/dal/user/types";
import { isRateLimitedLogin } from "@/lib/services/rate-limit/auth";
import { redirect } from "next/navigation";
import { z } from "zod";

export type LoginFormData = {
  username: string;
  password?: string;
};

export const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

async function login(formData: FormData): Promise<FormState<LoginFormData>> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    if (await isRateLimitedLogin()) {
      throw new Error("Too many requests.");
    }

    const parseResult = loginSchema.safeParse({ username, password });

    if (!parseResult.success) {
      throw new Error(undefined, {
        cause: parseResult.error.flatten().fieldErrors,
      });
    }

    const dto = parseResult.data;
    const user = await findUserByCredentials(dto.username, dto.password);

    const token = generateSessionToken();
    const session = await createSession(token, user.id);
    await setSessionTokenCookie(token, session.expiresAt);

    return {
      success: true,
      message: "",
    };
  } catch (e) {
    if (!(e instanceof Error)) throw e;

    return {
      success: false,
      message:
        e.message ||
        "Please review the form and correct the errors to proceed with your login.",
      errors: e.cause as Record<string, unknown>,
      controls: { username }, // Do not pass password back.
    } satisfies FormState<LoginFormData>;
  }
}

async function loginAction(
  _: FormState<LoginFormData> | null,
  formData: FormData,
): Promise<FormState<LoginFormData>> {
  "use server";
  const response = await login(formData);

  if (response.success) {
    redirect("/recipes");
  }

  return response;
}

export { loginAction };
