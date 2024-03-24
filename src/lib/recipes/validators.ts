import { z } from "zod";

const AddRecipeValidator = z.object({
  name: z.string().trim().min(2),
  totalDuration: z.string().regex(/\d{2}:\d{2}/),
  servings: z.coerce.number().min(0),
  ingredients: z.array(
    z.object({
      publicId: z.string(),
      measurement: z.object({
        amount: z.string(),
        unit: z.string(),
      }),
    }),
  ),
  steps: z.array(
    z.object({
      uuid: z.string(),
      description: z.string().max(255),
    }),
  ),
});

const UpdateRecipeValidator = AddRecipeValidator.merge(
  z.object({
    publicId: z.string(),
  }),
);

type Recipe = z.infer<typeof UpdateRecipeValidator>;

export { AddRecipeValidator, UpdateRecipeValidator, type Recipe };
