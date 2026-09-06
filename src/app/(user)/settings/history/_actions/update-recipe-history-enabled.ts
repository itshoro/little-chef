"use server";

import { UnauthenticatedError } from "@/lib/domain/auth/unauthenticated-error";
import { dtoFromFormData } from "@/lib/transformer/user/update-recipe-history-enabled-transformer";
import { requireSession } from "@/lib/utils/auth/require-session";
import { updateRecipeHistoryEnabled } from "@/lib/utils/user/update-recipe-history-enabled";

async function changeRecipeHistoryEnabled(formData: FormData) {
  const { user } = await requireSession({
    onUnauthenticated: () => {
      throw new UnauthenticatedError();
    },
  });

  const dto = dtoFromFormData(formData);
  await updateRecipeHistoryEnabled(user, dto.recipeHistoryEnabled);
}

export { changeRecipeHistoryEnabled };
