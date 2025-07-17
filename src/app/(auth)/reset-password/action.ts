import { unsafeGetPasswordResetRequest } from "@/lib/dal/session";
import { unsafeGetUserByIdentifier } from "@/lib/dal/user";
import { changePassword } from "@/lib/services/auth";
import type { AuthenticatedUser } from "@/lib/services/auth/types";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import { passwordSchema } from "@/lib/validators/user";
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

async function resetPassword(token: string, formData: FormData) {
  if (await isRateLimitedGlobally("write")) {
    throw new Error("Too many requests.");
  }

  const password = formData.get("password") as string;
  const confirmationPassword = formData.get("confirmation-password") as string;

  const dto = resetPasswordSchema.parse({
    password,
    confirmationPassword,
  });

  const resetRequest = await unsafeGetPasswordResetRequest(token);
  if (resetRequest === null) {
    throw new Error("Invalid or expired token.");
  }

  const user = await unsafeGetUserByIdentifier({ id: resetRequest.userId });
  if (!user) {
    throw new Error("Invalid or expired token.");
  }

  await changePassword(user as AuthenticatedUser, dto.password);

  redirect("/");
}

async function resetPasswordAction(token: string, formData: FormData) {
  "use server";
  await resetPassword(token, formData);
}

export { resetPasswordAction };
