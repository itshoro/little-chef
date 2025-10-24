import { visibilitySchema } from "@/lib/transformer/shared/visibility";
import * as z from "zod";

const ChangeDefaultVisibility = z.object({
  visibility: visibilitySchema,
});

export function dtoFromFormData(formData: FormData) {
  const visibility = formData.get("visibility") as string;

  return ChangeDefaultVisibility.parse({
    visibility,
  });
}
