import type { FormState } from "@/components/forms/form/root";
import type { DrizzleRecipe } from "@/drizzle/schema";
import { assertAuthenticatedForServerAction } from "@/lib/services/auth";
import { createRecipe } from "@/lib/services/recipe";
import type { RecipeOutputPublicDTO } from "@/lib/services/recipe/types";
import { generateHandle } from "@/lib/slug";
import { createRecipeSchema } from "@/lib/validators/recipe";
import { redirect } from "next/navigation";
import { z } from "zod";

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

async function createAction(
  _: FormState<CreateRecipeControls>,
  formData: FormData,
): Promise<FormState<CreateRecipeControls>> {
  "use server";
  const name = formData.get("name") as string;
  const coverImage = formData.get("cover") as File;
  const description = formData.get("description") as string;
  const preparationTime = formData.get("preparationTime") as string;
  const cookingTime = formData.get("cookingTime") as string;
  const visibility = formData.get("visibility") as string;
  const stepUuids = formData.getAll("step.uuid") as string[];
  const recommendedServingSize = Number(formData.get("servings") as string);

  const steps = Array.from(stepUuids).map(
    (uuid) => formData.get(`step.${uuid}`) as string,
  );

  const file =
    coverImage instanceof File && coverImage.size > 0 ? coverImage : null;

  let recipe: RecipeOutputPublicDTO;
  try {
    const { user } = await assertAuthenticatedForServerAction();

    const payload = {
      name,
      cover: { update: true, file },
      description,
      preparationTime,
      cookingTime,
      visibility,
      recommendedServingSize,
      steps,
    };

    const parseResult = createRecipeSchema.parse(payload);
    parseResult.steps;
    recipe = await createRecipe(parseResult, user);
  } catch (e) {
    if (!(e instanceof Error)) throw e;

    const controls = {
      name,
      description,
      cover: coverImage,
      recommendedServingSize,
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

  redirect(`/recipes/${generateHandle(recipe.slug, recipe.publicId)}`);
}

export { createAction };
