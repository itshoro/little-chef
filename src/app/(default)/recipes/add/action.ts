import type { FormState } from "@/app/components/form/root";
import type { Recipe } from "@/drizzle/schema";
import { createRecipe } from "@/lib/dal/recipe";
import { findUserBySessionId, subscribeToRecipe } from "@/lib/dal/user";
import { visibilitySchema } from "@/lib/dal/user/types";
import { generateSlugPathSegment } from "@/lib/slug";
import { redirect } from "next/navigation";
import { z } from "zod";

export const createRecipeSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().min(2),
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

export type CreateRecipeControls = {
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
  priorCover: FormDataEntryValue,
  coverImage: FormDataEntryValue,
) {
  const shouldUpdateCoverImage = priorCover === "" || coverImage !== null;
  const cover = shouldUpdateCoverImage
    ? ({ update: true, image: coverImage } as const)
    : ({ update: false } as const);

  return cover;
}

async function createAction(
  _: FormState<CreateRecipeControls>,
  formData: FormData,
): Promise<FormState<CreateRecipeControls>> {
  "use server";
  const sessionId = formData.get("sessionId") as string;
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

  let recipe: Recipe;
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
    };

    const parseResult = createRecipeSchema.parse(payload);

    recipe = await createRecipe(parseResult);
    await subscribeToRecipe(user.publicId, recipe, "creator");
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
    } satisfies FormState<CreateRecipeControls>;
  }

  redirect(`/recipes/${generateSlugPathSegment(recipe.slug, recipe.publicId)}`);
}

export { createAction };
