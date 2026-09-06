export interface HistoryPreferences {
  id: number;
  userId: number;
  recipeTrackingEnabled: boolean;
}

export const DEFAULT_HISTORY_PREFERENCES: Omit<
  HistoryPreferences,
  "id" | "userId"
> = {
  recipeTrackingEnabled: true,
};
