export const RECIPE_VISIBILITIES = ["public", "unlisted", "private"] as const;

export interface RecipePreferences {
  id: number;
  defaultVisibility: (typeof RECIPE_VISIBILITIES)[number];
  defaultServingSize: number;
}

export const DEFAULT_RECIPE_PREFERENCES: Readonly<
  Omit<RecipePreferences, "id">
> = {
  defaultVisibility: "private",
  defaultServingSize: 2,
};
