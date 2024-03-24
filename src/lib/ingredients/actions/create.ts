"use server";
import "server-only";

import { nanoid } from "@/lib/nanoid";
import { getPrismaClient } from "@/lib/prisma";
import { z } from "zod";

const IngredientValidator = z.object({
  name: z.string(),
  languageCode: z.string(),
});

type CreateIngredientType = z.infer<typeof IngredientValidator>;

async function createIngredient(ingredient: CreateIngredientType) {
  const prisma = getPrismaClient();
  return await prisma.ingredient.create({
    data: {
      publicId: nanoid(),
      name: {
        create: {
          name: ingredient.name,
          language: {
            connect: {
              code: ingredient.languageCode,
            },
          },
        },
      },
    },
  });
}

export { createIngredient, type CreateIngredientType, IngredientValidator };
