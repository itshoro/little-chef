import type { UpdateCollectionDTO } from "@/application/use-case/collection/update-collection";
import { visibilitySchema } from "@/transformer/shared/visibility";
import * as z from "zod/mini";

const Collection = z.object({
  publicId: z.string(),
  name: z.string().check(z.trim(), z.minLength(2)),
  visibility: visibilitySchema,
});

export function dtoFromFormData(formData: FormData): UpdateCollectionDTO {
  const name = formData.get("name") as string;
  const visibility = formData.get("visibility") as string;
  const publicId = formData.get("publicId") as string;

  const result = Collection.parse({ name, publicId, visibility });

  return {
    name: result.name,
    publicId: result.publicId,
    visibility: result.visibility,
  };
}
