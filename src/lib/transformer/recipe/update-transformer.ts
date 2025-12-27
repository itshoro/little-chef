import "server-only";

import type { UpdateRecipeDTO } from "@/lib/application/use-case/recipe/update-recipe";
import { visibilitySchema } from "@/lib/transformer/shared/visibility";
import * as z from "zod/mini";
import { FileReference } from "../file-reference/transformer";
import { Step } from "../step/transformer";
import type { Recipe } from "@/lib/domain/recipe/recipe";

const UpdateRecipe = z.object({
  name: z.string().check(z.minLength(2), z.trim()),
  description: z.nullable(z.string()),
  recommendedServingSize: z.coerce.number().check(z.minimum(1)),
  preparationTime: z.coerce.number().check(z.minimum(0)),
  cookingTime: z.coerce.number().check(z.minimum(0)),
  visibility: visibilitySchema,
  steps: z.array(z.string()),
});

export function dtoFromFormData(formData: FormData): {
  publicId: Recipe["publicId"];
  dto: UpdateRecipeDTO;
} {
  const publicId = formData.get("publicId") as string;
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
    description,
    preparationTime,
    cookingTime,
    visibility,
    recommendedServingSize,
    steps,
  };

  return {
    publicId,
    dto: {
      recipe: UpdateRecipe.parse(payload),
      cover: FileReference.parse(cover),
      steps: steps.map((step, i) => ({
        description: Step.parse(step),
        order: i,
      })),
      deletePreviousCover: formData.get("coverDeleted") === "true",
    },
  };
}
