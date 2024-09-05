import * as fs from "fs/promises";
import type { Session, User } from "lucia";
import { Argon2id } from "oslo/password";
import path from "path";
import sharp from "sharp";
import { lucia, validateRequest } from "../auth/lucia";
import { nanoid } from "../nanoid";

import { db } from "@/drizzle/db";
import * as schema from "@/drizzle/schema";
import { and, count, eq, inArray, like, or, sql } from "drizzle-orm";
import { getRecipe } from "./recipe";

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
  user: User,
  currentPassword: string,
  newPassword: Password,
) {
  const hashedPassword = await getHashedPassword(user.id);
  if (!(await equalsPassword(hashedPassword, currentPassword))) return;

  await db
    .update(schema.users)
    .set({ hashedPassword: await new Argon2id().hash(newPassword) })
    .where(eq(schema.users.id, user.id));
}

async function equalsPassword(hash: string, password: string) {
  return await new Argon2id().verify(hash, password);
}

export type Password = string & { __brand: "ValidPassword" };

export const passwordRange = { min: 6, max: 255 } as const;
export function validatePassword(password: any): password is Password {
  if (typeof password !== "string") {
    throw new TypeError("Password needs to be a string.");
  }

  if (
    password.length < passwordRange.min ||
    password.length > passwordRange.max
  ) {
    throw new RangeError(
      `Password needs to be between ${passwordRange.min} and ${passwordRange.max} characters long. Received ${password.length} characters.`,
      {
        cause: {
          ...passwordRange,
          actual: password.length,
          target: "password",
        },
      },
    );
  }

  return true;
}

// MARK: Avatar
export async function changeAvatar(user: User, image: File) {
  const storageDirectoryPath = path.join(
    process.cwd(),
    "public",
    user.publicId,
  );

  await fs.mkdir(storageDirectoryPath, { recursive: true });

  const storagePath = path.join(storageDirectoryPath, "avatar.webp");
  await sharp(await image.arrayBuffer())
    .resize(200, 200)
    .toFile(storagePath);
}

// MARK: Username
export async function changeUsername(user: User, newUsername: Username) {
  // TODO: consider whether username should be unique, or some sort of discriminator system should be present.

  await db
    .update(schema.users)
    .set({ username: newUsername })
    .where(eq(schema.users.id, user.id));
}

export type Username = string & { brand: "ValidUsername" };

export const usernameRange = { min: 3, max: 31 } as const;
export function validateUsername(username: any): username is Username {
  if (typeof username !== "string") {
    throw new TypeError("Username needs to be a string.", {
      cause: { target: "username" },
    });
  }

  if (
    username.length < usernameRange.min ||
    username.length > usernameRange.max
  ) {
    throw new RangeError(
      `Username needs to be between ${usernameRange.min} and ${usernameRange.max} characters long.\r\n\r\n Received ${username.length} characters.`,
      {
        cause: {
          ...usernameRange,
          actual: username.length,
          target: "username",
        },
      },
    );
  }

  if (!/^[a-z0-9_-]+$/.test(username))
    throw new TypeError(
      "Username doesn't match required pattern. Only lowercase letters, numbers, minus and underscore are allowed symbols.",
      {
        cause: { target: "username" },
      },
    );

  return true;
}

// MARK: utils
export async function getUser(publicId: string | undefined) {
  if (!publicId) return undefined;

  const userResult = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.publicId, publicId))
    .limit(1);

  if (userResult.length === 0) {
    throw new Error("Couldn't find user", { cause: publicId });
  }

  return userResult[0];
}

// MARK: CRUD

export async function createUser(username: string, hashedPassword: string) {
  const existingUser = await db
    .selectDistinct({ username: schema.users.username })
    .from(schema.users)
    .where(eq(schema.users.username, username));

  if (existingUser.length !== 0) {
    throw new Error("A user with that name already exists.", {
      cause: { target: "username" },
    });
  }

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
  publicUserId: string,
  recipe: typeof schema.recipes.$inferSelect,
  role: typeof schema.recipeSubscriptions.$inferInsert.role,
) {
  const user = await getUser(publicUserId);
  if (!user) {
    throw new Error("Failed to subscribe to recipe", { cause: publicUserId });
  }

  await db.insert(schema.recipeSubscriptions).values({
    recipeId: recipe.id,
    userId: user.id,
    role,
  });
}

export async function getSubcribedRecipes(userId: number, query: string) {
  return await db
    .selectDistinct({
      id: schema.recipes.id,
      publicId: schema.recipes.publicId,
    })
    .from(schema.recipeSubscriptions)
    .where(
      and(
        eq(schema.recipeSubscriptions.userId, userId),
        like(schema.recipes.name, `%${query}%`),
      ),
    )
    .innerJoin(
      schema.recipes,
      eq(schema.recipes.id, schema.recipeSubscriptions.recipeId),
    );
}

export async function getMaintainedCollections(
  user: User,
  recipePublicId: string,
) {
  const maintainedCollectionIds = await db
    .selectDistinct({ id: schema.collectionSubscriptions.collectionId })
    .from(schema.collectionSubscriptions)
    .where(
      and(
        eq(schema.collectionSubscriptions.userId, user.id),
        or(
          eq(schema.collectionSubscriptions.role, "creator"),
          eq(schema.collectionSubscriptions.role, "maintainer"),
        ),
      ),
    );

  const recipe = await getRecipe({ publicId: recipePublicId });
  const collectionResults = await db
    .selectDistinct({
      collection: {
        id: schema.collections.id,
        publicId: schema.collections.publicId,
        itemCount: schema.collections.itemCount,
        isCustom: schema.collections.isCustom,
        likes: schema.collections.likes,
        name: schema.collections.name,
        slug: schema.collections.slug,
        visibility: schema.collections.visibility,
      },
      recipeOccurrences: count(schema.collectionRecipes.recipeId),
    })
    .from(schema.collections)
    .leftJoin(
      schema.collectionRecipes,
      and(
        eq(schema.collectionRecipes.collectionId, schema.collections.id),
        eq(schema.collectionRecipes.recipeId, recipe.id),
      ),
    )
    .where(
      and(
        inArray(
          schema.collections.id,
          maintainedCollectionIds.map(({ id }) => id),
        ),
      ),
    )
    .groupBy(schema.collectionRecipes.recipeId, schema.collections.id);

  return collectionResults;
}

export async function subscribeToCollection(
  publicUserId: string,
  collection: typeof schema.collections.$inferSelect,
  role: typeof schema.collectionSubscriptions.$inferInsert.role,
) {
  const user = await getUser(publicUserId);
  if (!user) {
    throw new Error("Unable to subscribe to collection", {
      cause: publicUserId,
    });
  }

  await db.insert(schema.collectionSubscriptions).values({
    collectionId: collection.id,
    userId: user.id,
    role,
  });
}

export async function isRecipeLiked(publicUserId: string, recipeId: number) {
  const user = await getUser(publicUserId);
  if (!user) return false;

  const queryResult = await db
    .select()
    .from(schema.recipeSubscriptions)
    .where(
      and(
        eq(schema.recipeSubscriptions.userId, user.id),
        eq(schema.recipeSubscriptions.recipeId, recipeId),
        eq(schema.recipeSubscriptions.role, "subscriber"),
      ),
    );
  return queryResult.length !== 0;
}

export async function addRecipeLike(
  publicUserId: string,
  publicRecipeId: string,
) {
  const user = await getUser(publicUserId);
  if (!user) {
    throw new Error("Couldn't like recipe", {
      cause: { publicUserId, publicRecipeId },
    });
  }

  return await db.transaction(async (tx) => {
    const recipeQuery = await tx
      .update(schema.recipes)
      .set({ likes: sql`${schema.recipes.likes} + 1` })
      .where(eq(schema.recipes.publicId, publicRecipeId))
      .returning();

    if (recipeQuery.length !== 1) {
      throw new Error("Couldn't increment like count");
    }
    const recipe = recipeQuery[0];

    await tx.insert(schema.recipeSubscriptions).values({
      recipeId: recipe.id,
      userId: user.id,
      role: "subscriber",
    });

    return recipe.likes;
  });
}

export async function removeRecipeLike(
  publicUserId: string,
  publicRecipeId: string,
) {
  const user = await getUser(publicUserId);
  if (!user) {
    throw new Error("Couldn't like recipe", {
      cause: { publicUserId, publicRecipeId },
    });
  }

  return await db.transaction(async (tx) => {
    const recipeQuery = await tx
      .update(schema.recipes)
      .set({ likes: sql`${schema.recipes.likes} - 1` })
      .where(eq(schema.recipes.publicId, publicRecipeId))
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
          eq(schema.recipeSubscriptions.userId, user.id),
          eq(schema.recipeSubscriptions.role, "subscriber"),
        ),
      );

    return recipe.likes;
  });
}

export async function addCollectionLike(user: User, collectionId: number) {
  return await db.transaction(async (tx) => {
    const collectionQuery = await tx
      .update(schema.collections)
      .set({ likes: sql`${schema.collections.likes} + 1` })
      .where(eq(schema.collections.id, collectionId))
      .returning();

    if (collectionQuery.length !== 1) {
      throw new Error("Couldn't increment like count");
    }
    const collection = collectionQuery[0];

    await tx.insert(schema.collectionSubscriptions).values({
      collectionId: collection.id,
      userId: user.id,
      role: "subscriber",
    });

    return collection.likes;
  });
}

export async function removeCollectionLike(user: User, collectionId: number) {
  return await db.transaction(async (tx) => {
    const collectionQuery = await tx
      .update(schema.collections)
      .set({ likes: sql`${schema.collections.likes} - 1` })
      .where(eq(schema.collections.id, collectionId))
      .returning();

    if (collectionQuery.length !== 1) {
      throw new Error("Couldn't decrement like count");
    }
    const collection = collectionQuery[0];

    await tx
      .delete(schema.collectionSubscriptions)
      .where(
        and(
          eq(schema.collectionSubscriptions.collectionId, collection.id),
          eq(schema.collectionSubscriptions.userId, user.id),
          eq(schema.collectionSubscriptions.role, "subscriber"),
        ),
      );

    return collection.likes;
  });
}

export async function authorizeFromSession(sessionId: any) {
  if (typeof sessionId !== "string") {
    throw new Error("Unauthorized.");
  }

  const { user } = await validateRequest(sessionId);

  if (!user) {
    throw new Error("Unauthorized.");
  }
  return user;
}

export async function getHashedPassword(userId: number) {
  const result = await db
    .select({ hashedPassword: schema.users.hashedPassword })
    .from(schema.users)
    .where(eq(schema.users.id, userId));

  if (result.length !== 1)
    throw new Error("Couldn't find user.", { cause: { userId } });
  return result[0].hashedPassword;
}
