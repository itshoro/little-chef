"use server";

import type { DrizzleRecipe } from "@/drizzle/schema";
import { UnauthenticatedError } from "@/lib/errors/unauthenticated/error";
import { getAuthenticatedUserFromRequest } from "@/lib/services/auth";
import { updateRecipe } from "@/lib/services/recipe";
import type { RecipeOutputPublicDTO } from "@/lib/services/recipe/types";
import { generateHandle } from "@/lib/slug";
import { editRecipeSchema } from "@/lib/validators/recipe";
import type { Recipe } from "@cooklang/cooklang-ts";
import { redirect } from "next/navigation";
import { z } from "zod";

// export const editRecipeSchema = z.object({
//   publicId: z.string(),
//   name: z.string().trim().min(2),
//   description: z.string(),
//   servings: z.coerce.number().min(1),
//   preparationTime: z.coerce.number().min(0),
//   cookingTime: z.coerce.number().min(0),
//   visibility: visibilitySchema,
//   cover: z
//     .object({
//       update: z.literal(false),
//     })
//     .or(
//       z.object({
//         update: z.literal(true),
//         image: z.instanceof(File).nullable(),
//       }),
//     ),
//   step: z.record(z.string().trim().min(2)),
// });

function determineCover(
  priorCover: string,
  coverImage: FormDataEntryValue | null,
) {
  // FormData always returns a file object, even if the file input is empty.
  if (coverImage instanceof File && coverImage.size === 0) {
    coverImage = null;
  }

  const shouldUpdateCoverImage = priorCover === "" || coverImage !== null;
  const cover = shouldUpdateCoverImage
    ? ({ update: true, image: coverImage } as const)
    : ({ update: false } as const);

  return cover;
}

async function editAction(formData: FormData) {
  const publicId = formData.get("publicId") as string;
  const name = formData.get("name") as string;
  const priorCover = formData.get("priorCover") as string;
  const coverImage = formData.get("cover") as File;
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
    const cover = determineCover(priorCover, coverImage);

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
