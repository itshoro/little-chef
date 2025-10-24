"use server";

import { UnauthenticatedError } from "@/lib/domain/auth/unauthenticated-error";
import { generateHandle } from "@/lib/slug";
import { dtoFromFormData } from "@/lib/transformer/recipe/create-transformer";
import { requireSession } from "@/lib/utils/auth/require-session";
import { createRecipe } from "@/lib/utils/recipe/create-recipe";
import { redirect } from "next/navigation";

async function createAction(formData: FormData) {
  const { user } = await requireSession({
    onUnauthenticated: () => {
      throw new UnauthenticatedError();
    },
  });

  const dto = dtoFromFormData(formData);
  const recipeResult = await createRecipe(user, dto);
  if (!recipeResult.ok) throw new Error("Failed to create recipe.");

  redirect(
    `/recipes/${generateHandle(recipeResult.value.slug, recipeResult.value.publicId)}`,
  );
}

export { createAction };
