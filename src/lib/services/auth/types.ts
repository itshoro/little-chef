import type {
  DrizzleSession,
  DrizzleUser,
  DrizzleUserInsert,
} from "@/drizzle/schema";
import type { Password, Username } from "@/lib/validators/user";

type AuthenticatedUser = DrizzleUser & { __brand: "AuthenticatedUser" };

type SessionValidationResult =
  | { session: DrizzleSession; user: AuthenticatedUser }
  | { session: null; user: null };

type UserCredentials = { username: Username; password: Password };

type SignUpDTO = Omit<
  DrizzleUserInsert,
  | "id"
  | "publicId"
  | "hashedPassword"
  | "appPreferencesId"
  | "recipePreferencesId"
  | "collectionPreferencesId"
> &
  UserCredentials;

type LoginDTO = UserCredentials;

export type { AuthenticatedUser, SessionValidationResult, LoginDTO, SignUpDTO };
