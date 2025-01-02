import type { FormState } from "@/app/components/form/root";
import type { Recipe } from "@/drizzle/schema";
import { updateRecipe } from "@/lib/dal/recipe";
import { findUserBySessionId, subscribeToRecipe } from "@/lib/dal/user";
import { visibilitySchema } from "@/lib/dal/user/types";
import { generateSlugPathSegment } from "@/lib/slug";
import { redirect } from "next/navigation";
import { z } from "zod";

export const updateRecipeSchema = z.object({
  publicId: z.string(),
  name: z.string().trim().min(2),
  description: z.string().trim().min(2),
  servings: z.coerce.number().min(1),
  preparationTime: z.coerce.number().min(0),
  cookingTime: z.coerce.number().min(0),
  visibility: visibilitySchema,
  steps: z.array(
    z.object({
      uuid: z.string(),
      description: z.string().max(255),
    }),
  ),
  cover: z
    .object({
      update: z.literal(false),
    })
    .or(
      z.object({
        update: z.literal(true),
        image: z.instanceof(File).nullable(),
      }),
    ),
});

type UpdateRecipeControls = {
  sessionId?: string;
  publicId?: string;
  name: string;
  cover: File;
  priorCover: string;
  description: string;
  preparationTime: string;
  cookingTime: string;
  visibility: string;
  servings: number;
  steps: { uuid: string; description: string }[];
};

function determineCover(
  priorCover: FormDataEntryValue,
  coverImage: FormDataEntryValue,
) {
  const shouldUpdateCoverImage = priorCover === "" || coverImage !== null;
  const cover = shouldUpdateCoverImage
    ? ({ update: true, image: coverImage } as const)
    : ({ update: false } as const);

  return cover;
}

async function updateAction(
  _: FormState<UpdateRecipeControls>,
  formData: FormData,
): Promise<FormState<UpdateRecipeControls>> {
  "use server";
  const sessionId = formData.get("sessionId") as string;
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
  const steps = stepUuids.map((uuid) => ({
    uuid,
    description: formData.get(`step.${uuid}`) as string,
  }));

  let recipe: Recipe;
  try {
    const user = await findUserBySessionId(sessionId);
    const cover = determineCover(priorCover, coverImage);

    const parseResult = updateRecipeSchema.safeParse({
      name,
      cover,
      description,
      preparationTime,
      cookingTime,
      visibility,
      servings,
      steps,
      publicId,
    });

    if (!parseResult.success) {
      throw new Error(undefined, {
        cause: parseResult.error.flatten().fieldErrors,
      });
    }

    recipe = await updateRecipe(parseResult.data, user);
  } catch (e) {
    if (!(e instanceof Error)) throw e;

    return {
      success: false,
      message: e.message,
      errors: e.cause as Record<string, any>,
      controls: {
        name,
        description,
        cover: coverImage,
        priorCover,
        servings,
        cookingTime,
        preparationTime,
        visibility,
        steps,
      },
    } satisfies FormState<UpdateRecipeControls>;
  }

  redirect(`/recipes/${generateSlugPathSegment(recipe.slug, recipe.publicId)}`);
}

export { updateAction };
