export const supportedVisibilites = ["public", "unlisted", "private"] as const;
export type Visibility = (typeof supportedVisibilites)[number];

export const validateVisibility = (
  visibility: any,
): visibility is Visibility => {
  return supportedVisibilites.includes(visibility);
};
