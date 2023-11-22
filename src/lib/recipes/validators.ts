import { z } from "zod";

const AddRecipeValidator = z.object({
  name: z.string().trim().min(2),
  totalDuration: z.string().regex(/\d{2}:\d{2}/),
  servings: z.number().min(0),
  steps: z.array(z.string().max(255)),
});

export { AddRecipeValidator };
