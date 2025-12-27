import type { Visibility } from "../shared/visibility";

export interface CollectionPreferences {
  id: number;
  defaultVisibility: Visibility;
}

export const DEFAULT_COLLECTION_PREFERENCES: Readonly<
  Omit<CollectionPreferences, "id">
> = {
  defaultVisibility: "private",
};
