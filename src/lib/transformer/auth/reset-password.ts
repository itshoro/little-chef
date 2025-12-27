import { passwordSchema } from "@/lib/domain/user/credentials";
import * as z from "zod";

const ResetPassword = z
  .object({
    password: passwordSchema,
    confirmationPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmationPassword, {
    message: "Passwords must match.",
    path: ["confirmation-password"],
  });

export function dtoFromFormData(formData: FormData) {
  const password = formData.get("password") as string;
  const confirmationPassword = formData.get("confirmation-password") as string;

  return ResetPassword.parse({ password, confirmationPassword });
}
