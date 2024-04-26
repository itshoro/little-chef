import { getPrisma } from "../prisma";

// MARK: Language
export async function changeLanguage(sessionId: string, languageCode: string) {
  await using connection = getPrisma();
  const prisma = connection.prisma;

  const session = await prisma.session.findFirst({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session) return;

  await prisma.appPreferences.update({
    where: { userId: session.user.id },
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
  sessionId: string,
  theme: (typeof supportedThemes)[number],
) {
  await using connection = getPrisma();
  const prisma = connection.prisma;

  const session = await prisma.session.findFirst({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session) return;

  await prisma.appPreferences.update({
    where: { userId: session.user.id },
    data: { theme },
  });
}
