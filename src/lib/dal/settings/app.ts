import { PrismaClient } from "@prisma/client";

// MARK: Language
export async function changeLanguage(sessionId: string, languageCode: string) {
  const prisma = new PrismaClient();
  try {
    const session = await prisma.session.findFirst({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session) return;

    await prisma.appPreferences.update({
      where: { userId: session.user.id },
      data: { language: { connect: { code: languageCode } } },
    });
  } finally {
    await prisma.$disconnect();
  }
}

// MARK: Theme
export const supportedThemes = ["dark", "light", "system"] as const;

export function isSupportedTheme(
  theme: string,
): theme is (typeof supportedThemes)[number] {
  // @ts-expect-error - due to "as const" typeof theme is too broad leading to a type error
  return supportedThemes.includes(theme);
}

export async function changeTheme(
  sessionId: string,
  theme: (typeof supportedThemes)[number],
) {
  const prisma = new PrismaClient();
  try {
    const session = await prisma.session.findFirst({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session) return;

    await prisma.appPreferences.update({
      where: { userId: session.user.id },
      data: { theme },
    });
  } finally {
    await prisma.$disconnect();
  }
}
