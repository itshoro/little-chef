import { Argon2id } from "oslo/password";
import sharp from "sharp";
import { nanoid } from "../nanoid";
import { lucia } from "../auth/lucia";
import { Session } from "lucia";
import path from "path";
import * as fs from "fs/promises";

import { db } from "@/drizzle/db";
import { and, eq, or, sql } from "drizzle-orm";
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

  const storageDirectoryPath = path.join(
    process.cwd(),
    "public",
    session.users.publicId,
  );

  await fs.mkdir(storageDirectoryPath, { recursive: true });

  const storagePath = path.join(storageDirectoryPath, "avatar.webp");
  await sharp(await image.arrayBuffer())
    .resize(200, 200)
    .toFile(storagePath);
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
export async function findSessionUser(sessionId: string) {
  const sessions = await db
    .select()
    .from(schema.sessions)
    .where(eq(schema.sessions.id, sessionId)) // TODO: check expiresAt
    .innerJoin(schema.users, eq(schema.users.id, schema.sessions.userId))
    .limit(1);

  if (sessions.length === 0)
    throw new Error("No matching session found for " + sessionId);

  const [session] = sessions;

  // TODO look for less "hacky" solution
  return session;
}

// MARK: CRUD

export async function createUser(username: string, hashedPassword: string) {
  return await db.transaction(async (tx) => {
    try {
      const [appPreferences] = await tx
        .insert(schema.appPreferences)
        .values({})
        .returning();
      const [collectionPreferences] = await tx
        .insert(schema.collectionPreferences)
        .values({})
        .returning();
      const [recipePreferences] = await tx
        .insert(schema.recipePreferences)
        .values({})
        .returning();

      const [user] = await tx
        .insert(schema.users)
        .values({
          publicId: nanoid(),
          username: username,
          hashedPassword: hashedPassword,
          appPreferencesId: appPreferences.id,
          collectionPreferencesId: collectionPreferences.id,
          recipePreferencesId: recipePreferences.id,
        })
        .returning();

      return user;
    } catch (e) {
      if (e instanceof Error) {
        console.error(e);
      } else {
        console.error("Unknown error occured during user cration.");
      }

      return tx.rollback();
    }
  });
}

export async function findUserByQuery(query: string, take: number = 5) {
  return await db
    .selectDistinct()
    .from(schema.users)
    .where(or(eq(schema.users.username, query)))
    .limit(take);
}

export async function subscribeToRecipe(
  sessionId: string,
  recipe: typeof schema.recipes.$inferSelect,
  role: typeof schema.recipeSubscriptions.$inferInsert.role,
) {
  const sessionResult = await findSessionUser(sessionId);

  await db.insert(schema.recipeSubscriptions).values({
    recipeId: recipe.id,
    userId: sessionResult.users.id,
    role,
  });
}

export async function getSubcribedRecipes(userId: number) {
  return await db
    .selectDistinct({
      id: schema.recipes.id,
      publicId: schema.recipes.publicId,
    })
    .from(schema.recipeSubscriptions)
    .where(eq(schema.recipeSubscriptions.userId, userId))
    .innerJoin(
      schema.recipes,
      eq(schema.recipes.id, schema.recipeSubscriptions.recipeId),
    );
}

export async function subscribeToCollection(
  sessionId: string,
  collection: typeof schema.collections.$inferSelect,
  role: typeof schema.collectionSubscriptions.$inferInsert.role,
) {
  const sessionResult = await findSessionUser(sessionId);

  await db.insert(schema.collectionSubscriptions).values({
    collectionId: collection.id,
    userId: sessionResult.users.id,
    role,
  });
}

export async function isRecipeLiked(sessionId: string, recipeId: number) {
  const sessionResult = await findSessionUser(sessionId);

  const queryResult = await db
    .select()
    .from(schema.recipeSubscriptions)
    .where(
      and(
        eq(schema.recipeSubscriptions.userId, sessionResult.users.id),
        eq(schema.recipeSubscriptions.recipeId, recipeId),
        eq(schema.recipeSubscriptions.role, "subscriber"),
      ),
    );
  return queryResult.length !== 0;
}

export async function addRecipeLike(sessionId: string, recipePublicId: string) {
  const sessionResult = await findSessionUser(sessionId);

  return await db.transaction(async (tx) => {
    const recipeQuery = await tx
      .update(schema.recipes)
      .set({ likes: sql`${schema.recipes.likes} + 1` })
      .where(eq(schema.recipes.publicId, recipePublicId))
      .returning();

    if (recipeQuery.length !== 1) {
      throw new Error("Couldn't increment like count");
    }
    const recipe = recipeQuery[0];

    await tx.insert(schema.recipeSubscriptions).values({
      recipeId: recipe.id,
      userId: sessionResult.users.id,
      role: "subscriber",
    });

    return recipe.likes;
  });
}

export async function removeRecipeLike(
  sessionId: string,
  recipePublicId: string,
) {
  const sessionResult = await findSessionUser(sessionId);

  return await db.transaction(async (tx) => {
    const recipeQuery = await tx
      .update(schema.recipes)
      .set({ likes: sql`${schema.recipes.likes} - 1` })
      .where(eq(schema.recipes.publicId, recipePublicId))
      .returning();

    if (recipeQuery.length !== 1) {
      throw new Error("Couldn't increment like count");
    }
    const recipe = recipeQuery[0];

    await tx
      .delete(schema.recipeSubscriptions)
      .where(
        and(
          eq(schema.recipeSubscriptions.recipeId, recipe.id),
          eq(schema.recipeSubscriptions.userId, sessionResult.users.id),
          eq(schema.recipeSubscriptions.role, "subscriber"),
        ),
      );

    return recipe.likes;
  });
}
