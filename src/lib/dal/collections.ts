import * as schema from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq, or, and, like } from "drizzle-orm";
import type { Visibility } from "./visibility";
import { findSessionUser } from "./user";
import { alias } from "drizzle-orm/sqlite-core";

export async function getCollectionPreferences(sessionId: string) {
  const id = await getPreferencesId(sessionId);

  const result = await db
    .select()
    .from(schema.collectionPreferences)
    .where(eq(schema.collectionPreferences.id, id))
    .limit(1);

  if (result.length === 0) throw new Error("Couldn't find app preferences");
  const [preferences] = result;
  return preferences;
}

export async function getPreferencesId(sessionId: string) {
  const sessionResult = await findSessionUser(sessionId);

  const result = await db
    .select({ collectionPreferencesId: schema.users.collectionPreferencesId })
    .from(schema.users)
    .where(eq(schema.users.id, sessionResult.sessions.userId))
    .limit(1);

  if (result.length === 0) throw new Error("Couldn't find user");
  const [user] = result;

  return user.collectionPreferencesId;
}

export async function createCollections(
  ...collections: (typeof schema.collections.$inferSelect)[]
) {
  return await db.transaction(async (tx) => {
    return await Promise.all(
      collections.map((collection) =>
        tx.insert(schema.collections).values(collection),
      ),
    );
  });
}

export async function updateDefaultVisibility(
  sessionId: string,
  defaultVisibility: Visibility,
) {
  const id = await getPreferencesId(sessionId);

  await db
    .update(schema.collectionPreferences)
    .set({ defaultVisibility })
    .where(eq(schema.collectionPreferences.id, id));
}

export async function updateDefaultLanguage(
  sessionId: string,
  defaultLanguageCode: string,
) {
  const id = await getPreferencesId(sessionId);

  await db
    .update(schema.collectionPreferences)
    .set({ defaultLanguageCode })
    .where(eq(schema.collectionPreferences.id, id));
}

export async function getCreatorsAndMaintainers(collectionId: number) {
  return await db
    .select({
      username: schema.users.username,
      publicId: schema.users.publicId,
    })
    .from(schema.collectionSubscriptions)
    .where(
      and(
        eq(schema.collectionSubscriptions.collectionId, collectionId),
        or(
          eq(schema.collectionSubscriptions.role, "creator"),
          eq(schema.collectionSubscriptions.role, "maintainer"),
        ),
      ),
    )
    .innerJoin(
      schema.users,
      eq(schema.users.id, schema.collectionSubscriptions.userId),
    );
}

export async function getSubscriptions(userId: number) {
  return await db
    .select({
      id: schema.collections.id,
      publicId: schema.collections.publicId,
      role: schema.collectionSubscriptions.role,
    })
    .from(schema.collectionSubscriptions)
    .where(eq(schema.collectionSubscriptions.userId, userId))
    .innerJoin(
      schema.collections,
      eq(schema.collections.id, schema.collectionSubscriptions.collectionId),
    );
}

export async function findPublicIds(
  query: string,
  displayLanguageCode: string,
) {
  return await db
    .select({
      id: schema.collections.id,
      publicId: schema.collections.publicId,
      value: schema.translatables.value,
    })
    .from(schema.collections)
    .innerJoin(
      schema.translatables,
      and(
        eq(schema.translatables.key, schema.collections.nameKey),
        eq(schema.translatables.languageCode, displayLanguageCode),
      ),
    )
    .where(like(schema.translatables.value, `%${query}%`));
}

export async function getCollection(
  identifier: { id: number } | { publicId: string },
  displayLanguageCode: string,
) {
  const nameTranslation = alias(schema.translatables, "name");
  const slugTranslation = alias(schema.translatables, "slug");

  const collection = await db
    .select()
    .from(schema.collections)
    .where(
      "id" in identifier
        ? eq(schema.collections.id, identifier.id)
        : eq(schema.collections.publicId, identifier.publicId),
    )
    .innerJoin(
      slugTranslation,
      and(
        eq(slugTranslation.key, schema.collections.slugKey),
        eq(slugTranslation.languageCode, displayLanguageCode),
      ),
    )
    .innerJoin(
      nameTranslation,
      and(
        eq(nameTranslation.key, schema.collections.nameKey),
        eq(nameTranslation.languageCode, displayLanguageCode),
      ),
    );

  if (collection.length === 0) {
    throw new Error(
      `Couldn't find a collection with ${JSON.stringify(identifier)} and a display language of ${displayLanguageCode}`,
    );
  }
  return collection[0];
}

export async function getRecipeIds(collectionId: number) {
  // TODO: consider recipe visibility
  return await db
    .select({ id: schema.recipes.id, publicId: schema.recipes.publicId })
    .from(schema.collectionRecipes)
    .where(eq(schema.collectionRecipes.collectionId, collectionId))
    .innerJoin(
      schema.recipes,
      eq(schema.recipes.id, schema.collectionRecipes.recipeId),
    );
}
