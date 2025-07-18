import { z } from "zod";
import { visibilitySchema } from "../visibility";

const coverUpdateSchema = z
  .object({
    update: z.literal(true),
    file: z.instanceof(File).nullable(),
  })
  .or(
    z.object({
      update: z.literal(false),
      file: z.undefined(),
    }),
  );

export const createRecipeSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string(),
  recommendedServingSize: z.coerce.number().min(1),
  preparationTime: z.coerce.number().min(0),
  cookingTime: z.coerce.number().min(0),
  visibility: visibilitySchema,
  cover: coverUpdateSchema,
  steps: z.array(z.string().trim().min(2).max(280)),
});
export type CreateRecipeFormData = z.infer<typeof createRecipeSchema>;

export const editRecipeSchema = z.object({
  ...createRecipeSchema.shape,
  steps: z.record(z.string(), z.string().trim().min(2)),
  publicId: z.string(),
});
export type EditRecipeFormData = z.infer<typeof editRecipeSchema>;
