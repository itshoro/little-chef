import * as z from "zod";

const ChangeDefaultServingSize = z.object({
  servingSize: z.coerce.number().gt(0),
});

export function dtoFromFormData(formData: FormData) {
  const servingSize = formData.get("servingSize") as string;

  return ChangeDefaultServingSize.parse({
    servingSize,
  });
}
