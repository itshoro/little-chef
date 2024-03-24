"use server";
import "server-only";

import { getPrismaClient } from "@/lib/prisma";

type RecipeOverview = { name: string; id: string };

async function getOverview() {
  const prisma = getPrismaClient();

  return await prisma.recipe.findMany({ take: 10 });
}

type Recipe = Awaited<ReturnType<typeof getRecipeEntity>>;

async function getRecipeEntity(uuid: string) {
  const prisma = getPrismaClient();

  return await prisma.recipe.findFirstOrThrow({
    where: {
      publicId: uuid,
    },
    include: {
      RecipeIngredient: {
        include: {
          Ingredient: {
            include: {
              name: {
                include: {
                  language: true,
                },
              },
            },
          },
        },
      },
      RecipeStep: {
        include: {
          Step: true,
        },
      },
    },
  });

  // const [recipeResult, stepResults] = await Promise.all([
  //   connection.execute("SELECT * FROM recipes WHERE uuid = :uuid", { uuid }),
  //   connection.execute("SELECT * FROM recipe_steps WHERE parent_id = :uuid", {
  //     uuid,
  //   }),
  // ]);

  // if (recipeResult.size === 0) {
  //   throw new Error("Recipe not found.");
  // }

  // return toRecipe(recipeResult.rows[0], stepResults.rows);
}

// const cachedGetRecipe = cache(get);

export { getRecipeEntity, getOverview, type Recipe };
