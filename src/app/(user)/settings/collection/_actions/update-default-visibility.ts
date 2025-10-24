"use server";

import { UnauthenticatedError } from "@/lib/domain/auth/unauthenticated-error";
import { dtoFromFormData } from "@/lib/transformer/user/update-collection-default-visibility-transformer";
import { requireSession } from "@/lib/utils/auth/require-session";
import { updateDefaultVisibility } from "@/lib/utils/user/update-collection-default-visibility";

async function changeDefaultVisibilityAction(formData: FormData) {
  const { user } = await requireSession({
    onUnauthenticated: () => {
      throw new UnauthenticatedError();
    },
  });

  const dto = dtoFromFormData(formData);
  console.log(await updateDefaultVisibility(user, dto.visibility));
}

export { changeDefaultVisibilityAction };
