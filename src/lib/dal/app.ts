import { User } from "@prisma/client";
import { getPrisma } from "../prisma";

export async function getAppPreferences(userId?: User["id"]) {
  if (userId === undefined) return undefined;

  await using connection = getPrisma();
  const prisma = connection.prisma;

  return await prisma.appPreferences.findFirst({
    where: { userId },
  });
}

// MARK: Language
export async function changeLanguage(userId: User["id"], languageCode: string) {
  await using connection = getPrisma();
  const prisma = connection.prisma;

  await prisma.appPreferences.update({
    where: { userId },
    data: { language: { connect: { code: languageCode } } },
  });
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
  userId: User["id"],
  theme: (typeof supportedThemes)[number],
) {
  await using connection = getPrisma();
  const prisma = connection.prisma;

  await prisma.appPreferences.update({
    where: { userId: userId },
    data: { theme },
  });
}
