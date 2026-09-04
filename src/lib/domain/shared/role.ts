export type Role = (typeof roles)[number];

export const roles = ["owner", "maintainer", "editor", "viewer"] as const;
