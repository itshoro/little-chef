"use server";

import type { FormState } from "@/components/forms/form/root";
import { logIn } from "@/lib/services/auth";
import { isRateLimitedLogin } from "@/lib/services/rate-limit/auth";
import { loginSchema } from "@/lib/validators/auth";
import { redirect } from "next/navigation";

export type LoginFormData = {
  username: string;
  password?: string;
};

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

    await logIn(parseResult.data);

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
  formData: FormData,
): Promise<FormState<LoginFormData>> {
  const response = await login(formData);

  if (response.success) {
    redirect("/recipes");
  }

  return response;
}

export { loginAction };
