import type { Visibility } from "../shared/visibility";

export interface RecipePreferences {
  id: number;
  userId: number;
  defaultVisibility: Visibility;
  defaultServingSize: number;
}

export const DEFAULT_RECIPE_PREFERENCES: Readonly<
  Omit<RecipePreferences, "id" | "userId">
> = {
  defaultVisibility: "private",
  defaultServingSize: 2,
};
