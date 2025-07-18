"use server";

import { UnauthenticatedError } from "@/lib/errors/unauthenticated/error";
import { getAuthenticatedUserFromRequest } from "@/lib/services/auth";
import { updateRecipe } from "@/lib/services/recipe";
import type { RecipeOutputPublicDTO } from "@/lib/services/recipe/types";
import { generateHandle } from "@/lib/slug";
import { editRecipeSchema } from "@/lib/validators/recipe";
import { redirect } from "next/navigation";

type CoverUpdate =
  | {
      update: true;
      file: File | null;
    }
  | {
      update: false;
      file?: undefined;
    };

function determineCover(
  coverImage: FormDataEntryValue | null,
  coverDeleted: boolean,
) {
  if (coverDeleted) {
    return { update: true, file: null } satisfies CoverUpdate;
  }

  if (!(coverImage instanceof File) && coverImage !== null) {
    return { update: false } satisfies CoverUpdate;
  }

  // FormData always returns a file object, even if the file input is empty.
  if (coverImage instanceof File && coverImage.size === 0) {
    coverImage = null;
  }

  if (coverImage === null) {
    return { update: false } satisfies CoverUpdate;
  }
  return { update: true, file: coverImage } satisfies CoverUpdate;
}

async function editAction(formData: FormData) {
  const publicId = formData.get("publicId") as string;
  const name = formData.get("name") as string;
  const coverImage = formData.get("cover") as File;
  const coverDeleted = formData.get("coverDeleted") === "true";
  const description = formData.get("description") as string;
  const preparationTime = formData.get("preparationTime") as string;
  const cookingTime = formData.get("cookingTime") as string;
  const visibility = formData.get("visibility") as string;
  const stepUuids = formData.getAll("step.uuid") as string[];
  const servings = Number(formData.get("servings") as string);

  const steps = Object.fromEntries(
    Array.from(stepUuids).map((uuid) => [
      uuid,
      (formData.get(`step.${uuid}`) as string) || "",
    ]),
  );

  let recipe: RecipeOutputPublicDTO;
  try {
    const { user } = await getAuthenticatedUserFromRequest();
    if (!user) throw new UnauthenticatedError();
    const cover = determineCover(coverImage, coverDeleted);

    const payload = {
      name,
      cover,
      description,
      preparationTime,
      cookingTime,
      visibility,
      recommendedServingSize: servings,
      steps,
      publicId,
    };

    const parseResult = editRecipeSchema.parse(payload);
    recipe = await updateRecipe(parseResult, user);
  } catch (e) {
    if (!(e instanceof Error)) throw e;
    console.error(e);
    return;
  }

  redirect(`/recipes/${generateHandle(recipe.slug, recipe.publicId)}`);
}

export { editAction };
