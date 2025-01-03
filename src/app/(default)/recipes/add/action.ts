import type { FormState } from "@/app/components/form/root";
import type { Recipe } from "@/drizzle/schema";
import { createRecipe } from "@/lib/dal/recipe";
import { findUserBySessionId, subscribeToRecipe } from "@/lib/dal/user";
import { visibilitySchema } from "@/lib/dal/user/types";
import { generateSlugPathSegment } from "@/lib/slug";
import { redirect } from "next/navigation";
import { z } from "zod";

const stepSchema = z.string().trim().min(2);

export const createRecipeSchema = z
  .object({
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
    "step.uuid": z.array(z.string().uuid()),
  })
  .passthrough()
  .superRefine((data, ctx) => {
    for (const uuid of data["step.uuid"]) {
      const step = data[`step.${uuid}`];
      const result = stepSchema.safeParse(step);
      if (!result.success) {
        result.error.errors.forEach((error) => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: error.message,
            path: [`step.${uuid}`],
          });
        });
      }
    }
  });

export type CreateRecipeControls<TStepUuids extends string = string> = {
  sessionId?: string;
  name: string;
  cover: File;
  priorCover: string;
  description: string;
  preparationTime: number;
  cookingTime: number;
  visibility: string;
  servings: number;
} & StepControls<TStepUuids>;

type StepControls<TStepUuids extends string> = {
  "step.uuid": TStepUuids[];
} & {
  [K in NoInfer<TStepUuids> as `step.${K}`]: string;
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

  console.log(stepUuids);

  const steps = Object.fromEntries(
    stepUuids.map((uuid) => [
      `step.${uuid}`,
      formData.get(`step.${uuid}`) as string,
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
      "step.uuid": stepUuids,
      ...steps,
    };

    const parseResult = createRecipeSchema.safeParse(payload);

    if (!parseResult.success) {
      throw new Error(undefined, {
        cause: parseResult.error.flatten().fieldErrors,
      });
    }

    recipe = await createRecipe(parseResult.data);
    await subscribeToRecipe(user.publicId, recipe, "creator");
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
        cookingTime: Number(cookingTime),
        preparationTime: Number(preparationTime),
        visibility,
        "step.uuid": stepUuids,
        ...steps,
      },
    } satisfies FormState<CreateRecipeControls>;
  }

  redirect(`/recipes/${generateSlugPathSegment(recipe.slug, recipe.publicId)}`);
}

export { createAction };
