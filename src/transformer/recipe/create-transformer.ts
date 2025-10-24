import "server-only";

import type { CreateRecipeDTO } from "@/application/use-case/recipe/create-recipe";
import { visibilitySchema } from "@/transformer/shared/visibility";
import * as z from "zod/mini";
import { Step } from "../step/transformer";
import { FileReference } from "../file-reference/transformer";

const CreateRecipe = z.object({
  name: z.string().check(z.minLength(2), z.trim()),
  description: z.string(),
  recommendedServingSize: z.coerce.number().check(z.minimum(1)),
  preparationTime: z.coerce.number().check(z.minimum(0)),
  cookingTime: z.coerce.number().check(z.minimum(0)),
  visibility: visibilitySchema,
});

export function dtoFromFormData(formData: FormData): CreateRecipeDTO {
  const name = formData.get("name") as string;
  const coverImage = formData.get("cover") as File;
  const description = formData.get("description") as string;
  const preparationTime = formData.get("preparationTime") as string;
  const cookingTime = formData.get("cookingTime") as string;
  const visibility = formData.get("visibility") as string;
  const steps = formData.getAll("step[]") as string[];
  const recommendedServingSize = Number(formData.get("servings") as string);

  const cover =
    coverImage instanceof File && coverImage.size > 0 ? coverImage : null;

  const payload = {
    name,
    cover,
    description,
    preparationTime,
    cookingTime,
    visibility,
    recommendedServingSize,
    steps,
  };

  return {
    recipe: CreateRecipe.parse(payload),
    cover: FileReference.parse(cover),
    steps: steps.map((step, i) => ({
      description: Step.parse(step),
      order: i,
    })),
  };
}
