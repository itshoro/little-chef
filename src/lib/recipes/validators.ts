import { z } from "zod";

const AddRecipeValidator = z.object({
  name: z.string().trim().min(2),
  totalDuration: z.string().regex(/\d{2}:\d{2}/),
  servings: z.coerce.number().min(0),
  steps: z.array(z.string().max(255)),
});

type UnsavedRecipe = z.infer<typeof AddRecipeValidator>;

const UpdateRecipeValidator = AddRecipeValidator.merge(
  z.object({
    id: z.string(),
  })
);

type Recipe = z.infer<typeof UpdateRecipeValidator>;

export {
  AddRecipeValidator,
  type UnsavedRecipe,
  UpdateRecipeValidator,
  type Recipe,
};
