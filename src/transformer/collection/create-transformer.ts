import type { CreateCollectionDTO } from "@/application/use-case/collection/create-collection";
import { visibilitySchema } from "@/transformer/shared/visibility";
import * as z from "zod/mini";

const Collection = z.object({
  name: z.string().check(z.trim(), z.minLength(2)),
  visibility: visibilitySchema,
});

export function dtoFromFormData(formData: FormData): CreateCollectionDTO {
  const name = formData.get("name") as string;
  const visibility = formData.get("visibility") as string;

  const result = Collection.parse({ name, visibility });

  return {
    name: result.name,
    visibility: result.visibility,
  };
}
