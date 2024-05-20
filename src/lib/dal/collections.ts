import * as schema from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq, or, and } from "drizzle-orm";
import type { Visibility } from "./visibility";
import { findSessionUser } from "./user";

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
      id: schema.collectionSubscriptions.collectionId,
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

export async function getCollection(id: number, displayLanguageCode: string) {
  let collection = await db.query.collections.findFirst({
    with: {
      name: true,
      slug: true,
    },
    where: and(eq(schema.collections.id, id)),
  });

  if (collection === undefined) return undefined;

  const nameValue = await db.query.translatables.findFirst({
    where: and(
      eq(schema.translatables.key, collection.nameKey),
      eq(schema.translatables.languageCode, displayLanguageCode),
    ),
  });

  const slugValue = await db.query.translatables.findFirst({
    where: and(
      eq(schema.translatables.key, collection.slugKey),
      eq(schema.translatables.languageCode, displayLanguageCode),
    ),
  });

  type CollectionWithTranslation = Optional<typeof collection, "name" | "slug">;
  (collection as CollectionWithTranslation).name = nameValue;
  (collection as CollectionWithTranslation).slug = slugValue;

  return collection as CollectionWithTranslation;
}

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
