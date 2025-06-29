import { z } from "zod";
import { visibilitySchema } from "../visibility";

export const createCollectionSchema = z.object({
  name: z.string().trim().min(2),
  visibility: visibilitySchema,
});

export const editCollectionSchema = createCollectionSchema.merge(
  z.object({
    publicId: z.string(),
  }),
);
