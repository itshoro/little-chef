"use server";

import { UnauthenticatedError } from "@/lib/domain/auth/unauthenticated-error";
import { dtoFromFormData } from "@/lib/transformer/user/update-username-transformer";
import { requireSession } from "@/lib/utils/auth/require-session";
import { updateUsername } from "@/lib/utils/user/update-username";

const updateUsernameAction = async (formData: FormData) => {
  const { user } = await requireSession({
    onUnauthenticated: () => {
      throw new UnauthenticatedError();
    },
  });

  const dto = dtoFromFormData(formData);
  console.log(await updateUsername(user, dto.username));
};

export { updateUsernameAction };
