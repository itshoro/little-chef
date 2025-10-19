"use server";

import { dtoFromFormData } from "@/transformer/recipe/create-transformer";
import { requireSession } from "@/lib/auth/require-session";
import { UnauthenticatedError } from "@/lib/errors/unauthenticated/error";
import { generateHandle } from "@/lib/slug";
import { createRecipe } from "@/lib/utils/recipe/create-recipe";
import { redirect } from "next/navigation";

export type CreateRecipeControls = {
  sessionId?: string;
  name: string;
  cover: File;
  description: string;
  preparationTime: number;
  cookingTime: number;
  visibility: string;
  recommendedServingSize: number;
  step: Record<string, string>;
};

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
