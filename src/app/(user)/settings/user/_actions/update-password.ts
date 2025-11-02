"use server";

import { UnauthenticatedError } from "@/lib/domain/auth/unauthenticated-error";
import { dtoFromFormData } from "@/lib/transformer/user/update-password-transformer";
import { validateSession } from "@/lib/utils/auth/validate-session";
import { updatePassword } from "@/lib/utils/user/update-password";

async function changePasswordAction(formData: FormData) {
  const { user } = await validateSession();
  if (!user) throw new UnauthenticatedError();

  const dto = dtoFromFormData(formData);
  console.log(await updatePassword(user, dto.currentPassword, dto.newPassword));
}

export { changePasswordAction };
