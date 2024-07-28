import * as schema from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { getUser } from "./user";

async function getPreferencesId(publicUserId: string) {
  const user = await getUser(publicUserId);
  if (!user) throw new Error("User doesn't exist.", { cause: publicUserId });

  const result = await db
    .select({ appPreferencesId: schema.users.appPreferencesId })
    .from(schema.users)
    .where(eq(schema.users.id, user.id))
    .limit(1);

  if (result.length === 0) throw new Error("Couldn't find user");
  return result[0].appPreferencesId;
}

export async function getAppPreferences(publicUserId: string) {
  const id = await getPreferencesId(publicUserId);
  if (!id) throw new Error("User doesn't exist.", { cause: publicUserId });

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
  publicUserId: string,
  theme: (typeof supportedThemes)[number],
) {
  const id = await getPreferencesId(publicUserId);

  await db
    .update(schema.appPreferences)
    .set({ theme })
    .where(eq(schema.appPreferences.id, id));
}
