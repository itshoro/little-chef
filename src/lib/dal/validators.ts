import { z } from "zod";
import { supportedVisibilites } from "./visibility";

const AddRecipeValidator = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().min(2),
  servings: z.coerce.number().min(1),
  preparationTime: z.coerce.number().min(0),
  cookingTime: z.coerce.number().min(0),
  visibility: z.enum(supportedVisibilites),
  steps: z.array(
    z.object({
      uuid: z.string(),
      description: z.string().max(255),
    }),
  ),
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
});

const UpdateRecipeValidator = AddRecipeValidator.merge(
  z.object({
    publicId: z.string(),
  }),
);

type Recipe = z.infer<typeof UpdateRecipeValidator>;

const AddCollectionValidator = z.object({
  title: z.string().trim().min(2),
  visibility: z.enum(supportedVisibilites),
});

const UpdateCollectionValidator = AddCollectionValidator.merge(
  z.object({
    publicId: z.string(),
  }),
);

export {
  AddRecipeValidator,
  UpdateRecipeValidator,
  AddCollectionValidator,
  UpdateCollectionValidator,
  type Recipe,
};
