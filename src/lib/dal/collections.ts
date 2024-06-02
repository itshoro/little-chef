import * as schema from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq, or, and, like } from "drizzle-orm";
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

export async function findPublicCollections(query: string) {
  return await db
    .select({
      id: schema.collections.id,
      publicId: schema.collections.publicId,
      value: schema.collections.name,
      slug: schema.collections.slug,
    })
    .from(schema.collections)
    .where(like(schema.collections.name, `%${query}%`));
}

export async function getCollection(id: number) {
  const collections = await db
    .select()
    .from(schema.collections)
    .where(eq(schema.collections.id, id));

  if (collections.length === 0) {
    throw new Error(`Couldn't find a collection with id ${id}.`);
  }
  return collections[0];
}
