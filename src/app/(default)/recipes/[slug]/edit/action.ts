import type { FormState } from "@/components/forms/form/root";
import type { DrizzleRecipe } from "@/drizzle/schema";
import { updateRecipe } from "@/lib/dal/auth";
import { findUserBySessionId } from "@/lib/dal/user";
import { visibilitySchema } from "@/lib/dal/user/types";
import { generateHandle } from "@/lib/slug";
import { redirect } from "next/navigation";
import { z } from "zod";

export const editRecipeSchema = z.object({
  publicId: z.string(),
  name: z.string().trim().min(2),
  description: z.string(),
  servings: z.coerce.number().min(1),
  preparationTime: z.coerce.number().min(0),
  cookingTime: z.coerce.number().min(0),
  visibility: visibilitySchema,
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
  step: z.record(z.string().trim().min(2)),
});

export type EditRecipeControls = {
  sessionId?: string;
  name: string;
  cover: File;
  priorCover: string;
  description: string;
  preparationTime: number;
  cookingTime: number;
  visibility: string;
  servings: number;
  step: Record<string, string>;
};

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

async function editAction(
  _: FormState<EditRecipeControls>,
  formData: FormData,
): Promise<FormState<EditRecipeControls>> {
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

  const steps = Object.fromEntries(
    Array.from(stepUuids).map((uuid) => [
      uuid,
      (formData.get(`step.${uuid}`) as string) || "",
    ]),
  );

  let recipe: DrizzleRecipe;
  try {
    const user = await findUserBySessionId(sessionId);
    const cover = determineCover(priorCover, coverImage);

    const payload = {
      name,
      cover,
      description,
      preparationTime,
      cookingTime,
      visibility,
      servings,
      step: steps,
      publicId,
    };

    const parseResult = editRecipeSchema.parse(payload);

    recipe = await updateRecipe(parseResult, user);
  } catch (e) {
    if (!(e instanceof Error)) throw e;

    const controls = {
      name,
      description,
      cover: coverImage,
      priorCover,
      servings,
      cookingTime: Number(cookingTime),
      preparationTime: Number(preparationTime),
      visibility,
      step: steps,
    };

    if (e instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed.",
        errors: e.errors.reduce(
          (acc, error) => {
            const path = error.path.join(".");
            if (!acc[path]) acc[path] = [];
            acc[path].push(error.message);
            return acc;
          },
          {} as Record<string, string[]>,
        ),
        controls,
      };
    }

    return {
      success: false,
      message: e.message,
      errors: e.cause as Record<string, any>,
      controls,
    } satisfies FormState<EditRecipeControls>;
  }

  redirect(`/recipes/${generateHandle(recipe.slug, recipe.publicId)}`);
}

export { editAction };
