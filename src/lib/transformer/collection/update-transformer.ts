import type { UpdateCollectionDTO } from "@/lib/application/use-case/collection/update-collection";
import type { Collection } from "@/lib/domain/collection/collection";
import { visibilitySchema } from "@/lib/transformer/shared/visibility";
import * as z from "zod/mini";

const Collection = z.object({
  publicId: z.string(),
  name: z.string().check(z.trim(), z.minLength(2)),
  visibility: visibilitySchema,
});

export function dtoFromFormData(formData: FormData): {
  publicId: Collection["publicId"];
  dto: UpdateCollectionDTO;
} {
  const name = formData.get("name") as string;
  const visibility = formData.get("visibility") as string;
  const publicId = formData.get("publicId") as string;

  const result = Collection.parse({ name, publicId, visibility });

  return {
    publicId: result.publicId,
    dto: {
      name: result.name,
      visibility: result.visibility,
    },
  };
}
