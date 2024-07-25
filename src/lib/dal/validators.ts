import { z } from "zod";
import { supportedVisibilites } from "./visibility";

const AddRecipeValidator = z.object({
  name: z.string().trim().min(2),
  servings: z.coerce.number().min(0),
  preparationTime: z.coerce.number().min(0),
  cookingTime: z.coerce.number().min(0),
  visibility: z.enum(supportedVisibilites),
  // ingredients: z.array(
  //   z.object({
  //     publicId: z.string(),
  //     measurement: z.object({
  //       amount: z.number(),
  //       unit: z.string(),
  //     }),
  //   }),
  // ),
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
