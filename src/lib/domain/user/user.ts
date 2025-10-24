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
  role: "admin" | "user";
}
