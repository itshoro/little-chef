import type { Prisma, User } from "@prisma/client";
import { getPrisma } from "../prisma";
import type { Visibility } from "./recipe";

export async function getCollectionPreferences(userId?: User["id"]) {
  if (userId === undefined) return undefined;

  await using connection = getPrisma();
  const client = connection.prisma;

  return (
    (await client.collectionPreferences.findFirst({ where: { userId } })) ??
    undefined
  );
}

export async function createCollections(
  user: User,
  ...collections: Prisma.CollectionCreateInput[]
) {
  await using connection = getPrisma();
  const client = connection.prisma;

  await client.$transaction(async (tx) => {
    const createdCollections = await Promise.all(
      collections.map((collection) =>
        tx.collection.create({ data: collection }),
      ),
    );

    await tx.userCollections.createMany({
      data: createdCollections.map(
        (collection) =>
          ({
            collectionId: collection.id,
            userId: user.id,
          }) satisfies Parameters<
            typeof tx.userCollections.create
          >["0"]["data"],
      ),
    });
  });
}

export async function updateDefaultVisibility(
  userId: User["id"],
  visibility: Visibility,
) {
  await using connection = getPrisma();
  const prisma = connection.prisma;

  await prisma.collectionPreferences.update({
    data: {
      defaultVisibility: visibility,
    },
    where: { userId },
  });
}

export async function updateDefaultLanguage(
  userId: User["id"],
  languageCode: string,
) {
  await using connection = getPrisma();
  const prisma = connection.prisma;

  await prisma.collectionPreferences.update({
    data: {
      defaultLanguageCode: languageCode,
    },
    where: { userId },
  });
}
