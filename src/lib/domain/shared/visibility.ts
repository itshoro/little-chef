export type Visibility = (typeof VISIBILITIES)[number];

export const VISIBILITIES = ["private", "public", "unlisted"] as const;
