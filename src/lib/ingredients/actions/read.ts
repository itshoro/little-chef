"use server";
import "server-only";

import { getPrismaClient } from "@/lib/prisma";

type Ingredient = Awaited<ReturnType<typeof getIngredient>>;

async function selectIngredients(
  searchTerm: string,
  languageCode?: string,
  take?: number,
) {
  const prisma = getPrismaClient();

  return prisma.ingredient.findMany({
    take: take,
    where: {
      name: {
        some: { languageCode: languageCode, name: { contains: searchTerm } },
      },
    },
    include: { name: true },
  });
}

async function getIngredient(publicId: string, languageCode?: string) {
  const prisma = getPrismaClient();

  return prisma.ingredient.findFirstOrThrow({
    where: {
      publicId: publicId,
    },
    include: {
      name: languageCode ? { where: { languageCode: languageCode } } : true,
    },
  });
}

export { getIngredient, selectIngredients, type Ingredient };
