import type { FileReference } from "../shared/file-reference";
import type { Username } from "./credentials";

export interface User {
  readonly id: number;
  readonly publicId: string;

  readonly username: Username;
  readonly avatar: FileReference | null;
  readonly hashedPassword: string;
  readonly appPreferencesId: number;
  readonly collectionPreferencesId: number;
  readonly recipePreferencesId: number;
}
