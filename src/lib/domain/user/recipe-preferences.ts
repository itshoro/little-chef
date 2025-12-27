import type { Visibility } from "../shared/visibility";

export interface RecipePreferences {
  id: number;
  defaultVisibility: Visibility;
  defaultServingSize: number;
}

export const DEFAULT_RECIPE_PREFERENCES: Readonly<
  Omit<RecipePreferences, "id">
> = {
  defaultVisibility: "private",
  defaultServingSize: 2,
};
