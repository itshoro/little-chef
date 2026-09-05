export const THEMES = ["light", "dark", "system"] as const;

export interface AppPreferences {
  id: number;
  userId: number;
  theme: (typeof THEMES)[number];
}

export const DEFAULT_APP_PREFERENCES: Readonly<
  Omit<AppPreferences, "id" | "userId">
> = {
  theme: "system" as const,
};
