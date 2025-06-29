import { z } from "zod";
import { visibilitySchema } from "../visibility";

export const createRecipeSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string(),
  recommendedServingSize: z.coerce.number().min(1),
  preparationTime: z.coerce.number().min(0),
  cookingTime: z.coerce.number().min(0),
  visibility: visibilitySchema,
  cover: z.object({
    update: z.literal(true),
    file: z.instanceof(File).nullable(),
  }),
  steps: z.array(z.string().trim().min(2).max(280)),
});
