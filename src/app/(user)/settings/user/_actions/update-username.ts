"use server";

import { UnauthenticatedError } from "@/lib/errors/unauthenticated/error";
import { requireSession } from "@/lib/utils/auth/require-session";
import { updateUsername } from "@/lib/utils/user/update-username";
import { dtoFromFormData } from "@/transformer/user/update-username-transformer";

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
