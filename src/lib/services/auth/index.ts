import "server-only";

import { db, type Connection } from "@/drizzle/db";
import type {
  DrizzleSession,
  DrizzleSessionScope,
  DrizzleUser,
  DrizzleUserInsert,
  SessionIdentifier,
  UserIdentifier,
} from "@/drizzle/schema";
import { SESSION_COOKIE_NAME } from "@/lib/constants";
import {
  unsafeCreateSession,
  unsafeDeleteAllSessionsForUser,
  unsafeDeleteSession,
  unsafeGetSessionAndUserByToken,
  unsafeGetSessionScopes,
  unsafeUpdateSessionExpiresAt,
} from "@/lib/dal/session";
import {
  unsafeCreateAppPreferences,
  unsafeCreateCollectionPreferences,
  unsafeCreateRecipePreferences,
  unsafeCreateUser,
  unsafeGetUserByUsername,
  unsafeResolveUserId,
} from "@/lib/dal/user";
import { ConflictError } from "@/lib/errors/conflict/error";
import { InvalidCredentialsError } from "@/lib/errors/invalid-credentials/error";
import { UserNotFoundError } from "@/lib/errors/resource-not-found/user";
import { UnauthenticatedError } from "@/lib/errors/unauthenticated/error";
import { nanoid } from "@/lib/nanoid";
import type { Password } from "@/lib/validators/user";
import { hash, verify } from "@node-rs/argon2";
import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { toUserOutputPublicDTO } from "../user/transformer";
import type {
  AuthenticatedUser,
  LoginDTO,
  SessionValidationResult,
  SignUpDTO,
} from "./types";

export async function signUp(dto: SignUpDTO) {
  const existingUser = await unsafeGetUserByUsername(dto.username);
  if (existingUser) throw new ConflictError("That username is already taken.");

  return db.transaction(async (tx) => {
    const userDto: DrizzleUserInsert = {
      publicId: nanoid(),
      username: dto.username,
      avatar: dto.avatar,
      hashedPassword: await hash(dto.password),
      appPreferencesId: await unsafeCreateAppPreferences(tx, {}),
      recipePreferencesId: await unsafeCreateRecipePreferences(tx, {}),
      collectionPreferencesId: await unsafeCreateCollectionPreferences(tx, {}),
    };
    const user = await unsafeCreateUser(tx, userDto);

    const sessionToken = generateSessionToken();
    const session = await createSession(tx, sessionToken, user.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);

    return toUserOutputPublicDTO(user);
  });
}

export async function logIn(dto: LoginDTO) {
  const user = await unsafeGetUserByUsername(dto.username);
  if (!user) throw new UserNotFoundError({ username: dto.username });

  await assertValidCredentials(user as AuthenticatedUser, dto.password);

  return db.transaction(async (tx) => {
    const sessionToken = generateSessionToken();
    const session = await createSession(tx, sessionToken, user.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);

    return toUserOutputPublicDTO(user);
  });
}

export async function logOutSession(identifier: SessionIdentifier) {
  await unsafeDeleteSession(db, identifier);
  await deleteSessionTokenCookie();
}

export async function logOutAllUserSessions(identifier: UserIdentifier) {
  const userId = await unsafeResolveUserId(identifier);

  await unsafeDeleteAllSessionsForUser(db, { id: userId });
  await deleteSessionTokenCookie();
}

export async function getAuthenticatedUserFromRequest(): Promise<SessionValidationResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME);

  if (!token) {
    return { session: null, user: null };
  }

  return validateSessionToken(token.value);
}

export async function getAuthenticatedUserOrRedirect() {
  const result = await getAuthenticatedUserFromRequest();

  if (!result.user) {
    await deleteSessionTokenCookie();

    const headersStore = await headers();
    const searchParams = new URLSearchParams();
    searchParams.set("returnTo", headersStore.get("x-invoke-path")!);
    redirect(`/login?${searchParams.toString()}`);
  }

  return result;
}

export async function assertAuthenticatedForServerAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME);

  if (!token) {
    throw new UnauthenticatedError();
  }

  const { session, user } = await validateSessionToken(token.value);

  if (!session) {
    cookieStore.delete(SESSION_COOKIE_NAME);
    throw new UnauthenticatedError();
  }

  return { session, user };
}

function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

async function setSessionTokenCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

async function deleteSessionTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

async function createSession(
  connection: Connection,
  token: string,
  userId: DrizzleUser["id"],
) {
  const id = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days
  const session = await unsafeCreateSession(connection, {
    id,
    expiresAt,
    userId,
  });

  return session;
}

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionAndUser = await unsafeGetSessionAndUserByToken(token);

  if (!sessionAndUser) {
    return { session: null, user: null };
  }

  const { user, session } = sessionAndUser;
  if (Date.now() >= session.expiresAt.getTime()) {
    await logOutSession(session);
    return { session: null, user: null };
  }

  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await unsafeUpdateSessionExpiresAt(db, session, session.expiresAt);
  }

  return {
    session,
    user: user as AuthenticatedUser,
  };
}

async function assertValidCredentials(
  user: AuthenticatedUser | null,
  password: Password,
) {
  if (!(await verify(user?.hashedPassword ?? "", password))) {
    throw new InvalidCredentialsError();
  }
}

export async function hasSessionScopes(
  session: DrizzleSession,
  scopes: DrizzleSessionScope["scope"][],
) {
  const sessionScopes = await unsafeGetSessionScopes(session);
  return scopes.every((scope) => sessionScopes.some((s) => s.scope === scope));
}
