import { Argon2id } from "oslo/password";
import sharp from "sharp";
import { nanoid } from "../nanoid";
import { lucia } from "../auth/lucia";
import { Session } from "lucia";
import path from "path";

import { db } from "@/drizzle/db";
import { eq, or } from "drizzle-orm";
import * as schema from "@/drizzle/schema";

// MARK: Auth
/** Use @see{validateUsername} and @see{validatePassword} to validate your parameters. */
export async function validateUser(username: Username, password: Password) {
  const result = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.username, username))
    .limit(1);

  if (result.length === 0) {
    throw new Error("Username or password incorrect.");
  }

  const [existingUser] = result;

  const validPassword = await new Argon2id().verify(
    existingUser.hashedPassword,
    password,
  );

  if (!validPassword) {
    throw new Error("Username or password incorrect.");
  }

  return existingUser;
}

export async function invalidateSession(sessionId: Session["id"]) {
  await lucia.invalidateSession(sessionId);
}

// MARK: Password
export async function changePassword(
  sessionId: string,
  currentPassword: string,
  newPassword: Password,
) {
  const session = await findSessionUser(sessionId);

  if (!(await equalsPassword(session.users.hashedPassword, currentPassword)))
    return;

  await db
    .update(schema.users)
    .set({ hashedPassword: await new Argon2id().hash(newPassword) })
    .where(eq(schema.users.id, session.users.id));
}

async function equalsPassword(hash: string, password: string) {
  return await new Argon2id().verify(hash, password);
}

export type Password = string & { __brand: "ValidPassword" };

const passwordRange = { min: 6, max: 255 } as const;
export function validatePassword(password: any): password is Password {
  if (typeof password !== "string") {
    throw new TypeError("Password needs to be a string.");
  }

  if (
    password.length < passwordRange.min ||
    password.length > passwordRange.max
  ) {
    throw new RangeError(
      `Password needs to be between ${passwordRange.min} and ${passwordRange.max} characters long. Received ${password.length} characters`,
      {
        cause: {
          ...passwordRange,
          actual: password.length,
        },
      },
    );
  }

  return true;
}

// MARK: Avatar
export async function changeAvatar(sessionId: string, image: File) {
  const session = await findSessionUser(sessionId);

  await sharp(await image.arrayBuffer())
    .resize(200, 200)
    .toFile(
      path.join(process.cwd(), "public", session.users.publicId, "avatar.webp"),
    );
}

// MARK: Username
export async function changeUsername(sessionId: string, newUsername: Username) {
  // TODO: consider whether username should be unique, or some sort of discriminator system should be present.
  const session = await findSessionUser(sessionId);

  await db
    .update(schema.users)
    .set({ username: newUsername })
    .where(eq(schema.users.id, session.sessions.userId));
}

export type Username = string & { brand: "ValidUsername" };

const usernameRanges = { min: 3, max: 31 } as const;
export function validateUsername(username: any): username is Username | never {
  if (typeof username !== "string") {
    throw new TypeError("Username needs to be a string.");
  }

  if (
    username.length < usernameRanges.min ||
    username.length > usernameRanges.max
  ) {
    throw new RangeError(
      `Username needs to be between ${usernameRanges.min} and ${usernameRanges.max} characters long. Received ${username.length} characters`,
      {
        cause: {
          ...usernameRanges,
          actual: username.length,
        },
      },
    );
  }

  if (!/^[a-z0-9_-]+$/.test(username))
    throw new TypeError("Username doesn't match required pattern.");

  return true;
}

// MARK: utils
async function findSessionUser(sessionId: string) {
  const sessions = await db
    .select()
    .from(schema.sessions)
    .where(eq(schema.sessions.id, sessionId)) // TODO: check expiresAt
    .leftJoin(schema.users, eq(schema.users.id, schema.sessions.userId))
    .limit(1);

  if (sessions.length === 0)
    throw new Error("No matching session found for " + sessionId);

  const [session] = sessions;
  if (session.users === null) {
    throw new Error(
      "Couldn't find user associated with the session " + sessionId,
    );
  }

  // TODO look for less "hacky" solution
  return session as typeof session & {
    users: NonNullable<(typeof session)["users"]>;
  };
}

// MARK: CRUD

export async function createUser(username: string, hashedPassword: string) {
  return await db.transaction(async (tx) => {
    const [appPreferencesEntry] = await tx
      .insert(schema.appPreferences)
      .values({
        displayLanguageCode: "en",
      })
      .returning({ id: schema.appPreferences.id });
    const [collectionPreferencesEntry] = await tx
      .insert(schema.collectionPreferences)
      .values({
        defaultLanguageCode: "en",
      })
      .returning({ id: schema.collectionPreferences.id });
    const [recipePreferencesEntry] = await tx
      .insert(schema.recipePreferences)
      .values({
        defaultLanguageCode: "en",
      })
      .returning({ id: schema.recipePreferences.id });

    const defaultCollections = await tx
      .insert(schema.collections)
      .values([
        {
          publicId: nanoid(),
          isCustom: false,
          nameKey: "collection_name_general",
          slugKey: "collection_slug_general",
        },
        {
          publicId: nanoid(),
          isCustom: false,
          nameKey: "collection_name_liked",
          slugKey: "collection_slug_liked",
        },
      ])
      .returning({ id: schema.collections.id });

    const [user] = await tx
      .insert(schema.users)
      .values({
        publicId: nanoid(),
        username: username,
        hashedPassword: hashedPassword,
        appPreferencesId: appPreferencesEntry.id,
        collectionPreferencesId: collectionPreferencesEntry.id,
        recipePreferencesId: recipePreferencesEntry.id,
      })
      .returning();

    await tx.insert(schema.collectionSubscribers).values(
      defaultCollections.map((collection) => ({
        collectionId: collection.id,
        userId: user.id,
      })),
    );

    return user;
  });
}

export async function findUserByQuery(query: string, take: number = 5) {
  return await db
    .selectDistinct()
    .from(schema.users)
    .where(or(eq(schema.users.username, query)))
    .limit(take);
}
