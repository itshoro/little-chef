import * as schema from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";

async function getPreferencesId(userId: number) {
  const result = await db
    .select({ appPreferencesId: schema.users.appPreferencesId })
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);

  if (result.length === 0) throw new Error("Couldn't find user");
  const [user] = result;

  return user.appPreferencesId;
}

export async function getAppPreferences(userId: number) {
  const id = await getPreferencesId(userId);

  const result = await db
    .select()
    .from(schema.appPreferences)
    .where(eq(schema.appPreferences.id, id))
    .limit(1);

  if (result.length === 0) throw new Error("Couldn't find app preferences");
  const [preferences] = result;
  return preferences;
}

// MARK: Theme
export const supportedThemes = ["dark", "light", "system"] as const;

export function isSupportedTheme(
  theme: any,
): theme is (typeof supportedThemes)[number] {
  // @ts-expect-error - due to "as const" typeof theme is too broad leading to a type error
  return typeof theme === "string" && supportedThemes.includes(theme);
}

export async function changeTheme(
  userId: number,
  theme: (typeof supportedThemes)[number],
) {
  const id = await getPreferencesId(userId);

  await db
    .update(schema.appPreferences)
    .set({ theme })
    .where(eq(schema.appPreferences.id, id));
}
