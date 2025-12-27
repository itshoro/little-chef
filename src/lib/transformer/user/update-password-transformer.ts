import { passwordSchema } from "@/lib/domain/user/credentials";
import * as z from "zod";

const ChangePassword = z
  .object({
    currentPassword: z.string(),
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords must match.",
    path: ["confirmNewPassword"],
  });

export function dtoFromFormData(formData: FormData) {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const result = ChangePassword.parse({
    currentPassword,
    newPassword,
    confirmNewPassword: confirmPassword,
  });

  return result;
}
