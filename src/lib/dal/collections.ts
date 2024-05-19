import * as schema from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import type { Visibility } from "./visibility";

export async function getPreferencesId(userId: number) {
  const result = await db
    .select({ collectionPreferencesId: schema.users.collectionPreferencesId })
    .from(schema.users)
    .where(eq(schema.users.id, userId))
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
  userId: number,
  defaultVisibility: Visibility,
) {
  const id = await getPreferencesId(userId);

  await db
    .update(schema.collectionPreferences)
    .set({ defaultVisibility })
    .where(eq(schema.collectionPreferences.id, id));
}

export async function updateDefaultLanguage(
  userId: number,
  defaultLanguageCode: string,
) {
  const id = await getPreferencesId(userId);

  await db
    .update(schema.collectionPreferences)
    .set({ defaultLanguageCode })
    .where(eq(schema.collectionPreferences.id, id));
}
