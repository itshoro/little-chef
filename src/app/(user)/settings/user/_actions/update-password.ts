"use server";

import { UnauthenticatedError } from "@/lib/errors/unauthenticated/error";
import {
  changePassword,
  getAuthenticatedUserFromRequest,
} from "@/lib/services/auth";
import { changePasswordSchema } from "@/lib/validators/user";

async function changePasswordAction(data: FormData) {
  const currentPassword = data.get("currentPassword") as string;
  const newPassword = data.get("newPassword") as string;
  const confirmPassword = data.get("confirmPassword") as string;

  const { user } = await getAuthenticatedUserFromRequest();
  if (!user) throw new UnauthenticatedError();

  try {
    const verifiedDto = changePasswordSchema.parse({
      currentPassword,
      newPassword,
      confirmPassword,
    });
    await changePassword(user, verifiedDto.newPassword);

    return {
      success: true,
      message: "Successfully changed your password.",
    };
  } catch (e) {
    if (e instanceof Error) {
      return {
        success: false,
        message: e.message,
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

export { changePasswordAction };
