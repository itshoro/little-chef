import type { Visibility } from "../shared/visibility";

export interface CollectionPreferences {
  id: number;
  userId: number;
  defaultVisibility: Visibility;
}

export const DEFAULT_COLLECTION_PREFERENCES: Readonly<
  Omit<CollectionPreferences, "id" | "userId">
> = {
  defaultVisibility: "private",
};
