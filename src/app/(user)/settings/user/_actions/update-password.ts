"use server";

import { UnauthenticatedError } from "@/lib/errors/unauthenticated/error";
import { validateSession } from "@/lib/utils/auth/validate-session";
import { updatePassword } from "@/lib/utils/user/update-password";
import { dtoFromFormData } from "@/lib/transformer/user/update-password-transformer";

async function changePasswordAction(formData: FormData) {
  const { user } = await validateSession();
  if (!user) throw new UnauthenticatedError();

  const dto = dtoFromFormData(formData);
  console.log(await updatePassword(user, dto.newPassword));
}

export { changePasswordAction };
