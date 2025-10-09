export const COLLECTION_VISIBILITIES = [
  "public",
  "unlisted",
  "private",
] as const;

export interface CollectionPreferences {
  id: number;
  defaultVisibility: (typeof COLLECTION_VISIBILITIES)[number];
}

export const DEFAULT_COLLECTION_PREFERENCES: Readonly<
  Omit<CollectionPreferences, "id">
> = {
  defaultVisibility: "private",
};
