import * as z from "zod";

const ChangeRecipeHistoryEnabled = z.object({
  recipeHistoryEnabled: z.boolean(),
});

export function dtoFromFormData(formData: FormData) {
  const recipeHistoryEnabled =
    formData.get("recipeHistoryEnabled") === "enabled" ? true : false;

  return ChangeRecipeHistoryEnabled.parse({
    recipeHistoryEnabled,
  });
}
