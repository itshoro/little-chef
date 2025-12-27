export const THEMES = ["light", "dark", "system"] as const;

export interface AppPreferences {
  id: number;
  theme: (typeof THEMES)[number];
}

export const DEFAULT_APP_PREFERENCES: Readonly<Omit<AppPreferences, "id">> = {
  theme: "system" as const,
};
