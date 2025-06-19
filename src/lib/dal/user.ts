import { hash, verify } from "@node-rs/argon2";
import sharp from "sharp";
import { nanoid } from "../nanoid";

import { db } from "@/drizzle/db";
import * as schema from "@/drizzle/schema";
import { and, count, eq, inArray, like, lt, or, sql } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { getRecipe } from "./recipe";
import type { Password, Username } from "./user/types";

// MARK: Auth
export async function findUserByCredentials(
  username: Username,
  password: Password,
) {
  const result = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.username, username))
    .limit(1);

  if (result.length === 0) {
    throw new Error("Username or password incorrect.");
  }

  const [existingUser] = result;

  const validPassword = await verify(existingUser.hashedPassword, password);

  if (!validPassword) {
    throw new Error("Username or password incorrect.");
  }

  return existingUser;
}

export async function getUserScopes(user: schema.User) {
  return await db
    .select()
    .from(schema.userScopes)
    .where(eq(schema.userScopes.userId, user.id));
}

export async function userHasScopes(
  user: schema.User,
  requiredScopes: schema.UserScope["scope"][],
) {
  const scopes = (await getUserScopes(user)).map((s) => s.scope);
  return requiredScopes.every((scope) => scopes.includes(scope));
}

export async function getActiveSessionScopes(session: schema.Session) {
  return await db
    .select()
    .from(schema.sessionScopes)
    .where(
      and(
        eq(schema.sessionScopes.sessionId, session.id),
        lt(schema.sessionScopes.expiresAt, sql`(current_timestamp)`),
      ),
    );
}

export async function sessionHasActiveScopes(
  session: schema.Session,
  requiredScopes: schema.SessionScope["scope"][],
) {
  const scopes = (await getActiveSessionScopes(session)).map((s) => s.scope);
  return requiredScopes.every((scope) => scopes.includes(scope));
}

// MARK: Password
export async function changePassword(
  user: schema.User,
  currentPassword: string,
  newPassword: Password,
) {
  const hashedPassword = await getHashedPassword(user.id);
  if (!(await verify(hashedPassword, currentPassword))) return;

  await db
    .update(schema.users)
    .set({ hashedPassword: await hash(newPassword) })
    .where(eq(schema.users.id, user.id));
}

// MARK: Avatar
export async function changeAvatar(user: schema.User, image: File) {
  const resizedBuffer = await sharp(await image.arrayBuffer())
    .resize(200, 200)
    .toBuffer();

  const fileKey = user.avatar ? user.avatar.split("/").at(-1) : undefined;
  const utapi = new UTApi();

  const [avatar] = await Promise.all([
    utapi.uploadFiles(new File([resizedBuffer], image.name)),
    fileKey ? utapi.deleteFiles(fileKey) : undefined,
  ]);

  await db.transaction(async (tx) => {
    await tx
      .update(schema.users)
      .set({
        avatar: avatar.data?.url,
      })
      .where(eq(schema.users.id, user.id));
  });
}

// MARK: Username
export async function changeUsername(user: schema.User, newUsername: Username) {
  // TODO: consider whether username should be unique, or some sort of discriminator system should be present.

  await db
    .update(schema.users)
    .set({ username: newUsername })
    .where(eq(schema.users.id, user.id));
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
        console.error("Unknown error occurred during user creation.");
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

export async function getSubscribedRecipes(userId: number, query: string) {
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
  user: schema.User,
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

export async function addCollectionLike(
  user: schema.User,
  collectionId: number,
) {
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

export async function removeCollectionLike(
  user: schema.User,
  collectionId: number,
) {
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

export async function findUserBySessionId(sessionId: unknown) {
  if (typeof sessionId !== "string") {
    throw new Error("Unauthorized.");
  }

  const session = await db
    .select()
    .from(schema.sessions)
    .where(eq(schema.sessions.id, sessionId));

  if (session.length < 1 || Date.now() >= session[0].expiresAt.getTime()) {
    throw new Error("Unauthorized");
  }

  const user = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, session[0].userId));

  if (user.length < 1) {
    throw new Error("Unauthorized.");
  }
  return user[0];
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
