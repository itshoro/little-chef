import type { FileReference } from "../shared/file-reference";
import type { Username } from "./credentials";

export interface User {
  id: number;
  publicId: string;

  username: Username;
  avatar: FileReference | null;
  hashedPassword: string;
  appPreferencesId: number;
  collectionPreferencesId: number;
  recipePreferencesId: number;
  role: (typeof USER_ROLES)[number];
}

export const USER_ROLES = ["admin", "user"] as const;
