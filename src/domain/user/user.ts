import type { Username } from "./credentials";

export interface CreateUserParams {
  id: number;
  username: Username;
  publicId: string;
  avatar: string | null;
  hashedPassword: string;
  appPreferencesId: number;
  collectionPreferencesId: number;
  recipePreferencesId: number;
}

export class User {
  constructor(
    public readonly id: number,
    public readonly username: Username,
    public readonly publicId: string,
    public readonly avatar: string | null,
    public readonly hashedPassword: string,
    public readonly appPreferencesId: number,
    public readonly collectionPreferencesId: number,
    public readonly recipePreferencesId: number,
  ) {}

  static fromParams(params: CreateUserParams): User {
    return new User(
      params.id,
      params.username,
      params.publicId,
      params.avatar,
      params.hashedPassword,
      params.appPreferencesId,
      params.collectionPreferencesId,
      params.recipePreferencesId,
    );
  }
}
