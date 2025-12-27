import {
  FileReference,
  PublicFileReference,
  toPublicFileReference,
} from "../shared/file-reference";
import type { Username } from "./credentials";

export type PublicUser = Omit<User, "id" | "hashedPassword" | "avatar"> & {
  avatar: PublicFileReference | null;
  hashedPassword?: never;
  id?: never;
};

export interface User {
  readonly id: number;
  readonly publicId: string;
  username: Username;
  appPreferencesId: number;
  collectionPreferencesId: number;
  recipePreferencesId: number;
  role: (typeof USER_ROLES)[number];
  hashedPassword: string;
  avatar: FileReference | null;
}

export const USER_ROLES = ["admin", "user"] as const;

export function toPublicUser(user: User): PublicUser {
  return {
    appPreferencesId: user.appPreferencesId,
    collectionPreferencesId: user.collectionPreferencesId,
    recipePreferencesId: user.recipePreferencesId,
    publicId: user.publicId,
    role: user.role,
    username: user.username,
    avatar: user.avatar ? toPublicFileReference(user.avatar) : null,
  };
}
