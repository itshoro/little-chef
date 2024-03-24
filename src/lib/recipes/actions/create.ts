"use server";
import "server-only";

import { AddRecipeValidator } from "../validators";
import z from "zod";
import { getPrismaClient } from "@/lib/prisma";
import { nanoid } from "@/lib/nanoid";

async function createRecipeEntity(
  recipeDto: z.infer<typeof AddRecipeValidator>,
) {
  const prisma = getPrismaClient();
  return await prisma.recipe.create({
    data: {
      name: recipeDto.name,
      servings: recipeDto.servings,
      publicId: nanoid(),
      totalDuration: recipeDto.totalDuration,
      RecipeStep: {
        create: recipeDto.steps.map((step, i) => ({
          Step: {
            create: {
              description: step.description,
              publicId: step.uuid,
            },
          },
          order: i,
        })),
      },
      RecipeIngredient: {
        create: recipeDto.ingredients.map((ingredient) => ({
          Ingredient: {
            connect: {
              publicId: ingredient.publicId,
            },
          },
          measurementAmount: ingredient.measurement.amount,
          measurementUnit: ingredient.measurement.unit,
        })),
      },
    },
  });
}

export { createRecipeEntity };
