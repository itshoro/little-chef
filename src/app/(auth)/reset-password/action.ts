import type { FormState } from "@/app/components/form/root";
import {
  createSession,
  findPasswordResetRequest,
  generateSessionToken,
  invalidateAllSessions,
  setSessionTokenCookie,
} from "@/lib/auth";
import { updatePassword } from "@/lib/dal/user";
import { passwordSchema } from "@/lib/dal/user/types";
import { isRateLimitedGlobally } from "@/lib/rate-limit/global";
import { redirect } from "next/navigation";
import { z } from "zod";

type SignUpData = {
  password?: string;
  confirmPassword?: string;
  inviteCode?: string;
};

const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmationPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmationPassword, {
    message: "Passwords must match.",
    path: ["confirmation-password"],
  });

async function resetPassword(
  token: string,
  formData: FormData,
): Promise<FormState<SignUpData>> {
  try {
    if (await isRateLimitedGlobally("write")) {
      throw new Error("Too many requests.");
    }

    const password = formData.get("password") as string;
    const confirmationPassword = formData.get(
      "confirmation-password",
    ) as string;

    const parseResult = resetPasswordSchema.safeParse({
      password,
      confirmationPassword,
    });

    if (!parseResult.success) {
      throw new Error(undefined, {
        cause: parseResult.error.flatten().fieldErrors,
      });
    }

    const dto = parseResult.data;

    const resetRequest = await findPasswordResetRequest(token);
    if (resetRequest === null) {
      throw new Error("Invalid or expired token.");
    }

    await updatePassword({ id: resetRequest.userId }, dto.password);
    await invalidateAllSessions(resetRequest.userId);

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, resetRequest.userId);
    await setSessionTokenCookie(sessionToken, session.expiresAt);

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
      controls: {}, // Do not pass password back.
    } satisfies FormState<SignUpData>;
  }
}

async function resetPasswordAction(
  token: string,
  _: FormState<SignUpData>,
  formData: FormData,
): Promise<FormState<SignUpData>> {
  "use server";
  const response = await resetPassword(token, formData);

  if (response.success) redirect("/recipes");
  return response;
}

export { resetPasswordAction };
