"use server";

import { UnauthenticatedError } from "@/lib/errors/unauthenticated/error";
import { generateHandle } from "@/lib/slug";
import { requireSession } from "@/lib/utils/auth/require-session";
import { updateRecipe } from "@/lib/utils/recipe/update-recipe";
import { dtoFromFormData } from "@/transformer/recipe/update-transformer";
import { redirect } from "next/navigation";

async function editAction(formData: FormData) {
  const { user } = await requireSession({
    onUnauthenticated: () => {
      throw new UnauthenticatedError();
    },
  });

  const dto = dtoFromFormData(formData);

  const recipeResult = await updateRecipe(user, dto);
  if (!recipeResult.ok) throw recipeResult.error;

  redirect(
    `/recipes/${generateHandle(recipeResult.value.slug, recipeResult.value.publicId)}`,
  );
}

export { editAction };
