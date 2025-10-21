"use server";

import { UnauthenticatedError } from "@/lib/errors/unauthenticated/error";
import { requireSession } from "@/lib/utils/auth/require-session";
import { updateDefaultServingSize } from "@/lib/utils/user/update-recipe-default-serving-size";
import { dtoFromFormData } from "@/transformer/user/update-recipe-default-serving-size";

async function changeDefaultServingSizeAction(formData: FormData) {
  const { user } = await requireSession({
    onUnauthenticated: () => {
      throw new UnauthenticatedError();
    },
  });

  const dto = dtoFromFormData(formData);
  console.log(await updateDefaultServingSize(user, dto.servingSize));
}

export { changeDefaultServingSizeAction };
