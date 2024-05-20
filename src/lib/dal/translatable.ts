import * as schema from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq, and } from "drizzle-orm";

export async function getTranslation(key: string, displayLanguageCode: string) {
  const result = await db
    .select({ value: schema.translatables.value })
    .from(schema.translatables)
    .where(
      and(
        eq(schema.translatables.key, key),
        eq(schema.translatables.languageCode, displayLanguageCode),
      ),
    );

  if (result.length === 0)
    throw new Error(
      "Couldn't find translation for " + key + " in " + displayLanguageCode,
    );

  return result[0].value;
}
