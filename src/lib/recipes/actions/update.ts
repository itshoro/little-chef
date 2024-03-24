"use server";
import "server-only";

import { type Recipe } from "../validators";
import { customAlphabet } from "nanoid";
import { getPrismaClient } from "@/lib/prisma";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 15);

async function updateRecipeEntity(recipeDto: Recipe) {
  const prisma = getPrismaClient();

  const recipeId = (
    await prisma.recipe.findFirstOrThrow({
      where: { publicId: recipeDto.publicId },
      select: { id: true },
    })
  ).id;

  /**
   * Upsert is not supported for sqlite, so we need to manually delete all relevant entries
   * within RecipeSteps, Steps, RecipeIngredients and Ingredients and then recreating them.
   **/

  // Upsert (Recipe)Steps
  await prisma.$transaction(async (tx) => {
    await tx.step.deleteMany({
      where: { publicId: { in: recipeDto.steps.map((step) => step.uuid) } },
    });

    const steps = await Promise.all(
      recipeDto.steps.map((step) =>
        tx.step.create({
          data: {
            description: step.description,
            publicId: step.uuid,
          },
        }),
      ),
    );

    await Promise.all(
      steps.map((step, i) =>
        tx.recipeStep.create({
          data: {
            recipeId: recipeId,
            stepId: step.id,
            order: i,
          },
          include: {
            Step: true,
          },
        }),
      ),
    );
  });

  // Upsert (Recipe)Ingredients
  await prisma.$transaction(async (tx) => {
    // await tx.recipeIngredient.deleteMany({
    //   where: {
    //     Ingredient: {
    //       publicId: {
    //         in: recipeDto.ingredients.map((ingredient) => ingredient.uuid),
    //       },
    //     },
    //   },
    // });

    // Create all ingredients that aren't currently in existence using an upsert.
    await Promise.all(
      recipeDto.ingredients.map((ingredient) =>
        tx.ingredient.upsert({
          where: {
            name: ingredient.name,
          },
          update: {},
          create: {
            name: ingredient.name,
            publicId: ingredient.publicId,
          },
        }),
      ),
    );

    await Promise.all(
      recipeDto.ingredients.map((ingredient) =>
        tx.recipeIngredient.upsert({
          where: {
            Recipe: {
              /**
               * TODO: use publicId for lookup, so we can allow for ingredient i18n in the future.
               * For this we would need to validate the ingredients against a list of known ingredients on creation / update.
               *
               * Can we add new ones on the fly? I need to explore this more thorougly.
               */
              publicId: ingredient.publicId,
            },
            recipeId,
          },
          create: {
            recipeId,
            measurementAmount: ingredient.measurement.amount,
            measurementUnit: ingredient.measurement.unit,
            Ingredient: {
              connect: {
                publicId: ingredient.publicId,
              },
            },
          },
          update: {
            measurementAmount: ingredient.measurement.amount,
            measurementUnit: ingredient.measurement.unit,
          },
        }),
      ),
    );

    // await Promise.all(
    //   recipeDto.ingredients.map((ingredient) =>
    //     tx.ingredient.upsert({
    //       where: {
    //         /**
    //          * TODO: use publicId for lookup, so we can allow for ingredient i18n in the future.
    //          * For this we would need to validate the ingredients against a list of known ingredients on creation / update.
    //          *
    //          * Can we add new ones on the fly? I need to explore this more thorougly.
    //          */
    //         name: ingredient.name,
    //       },
    //       update: {
    //         RecipeIngredient: {
    //           updateMany: {
    //             where: { recipeId },
    //             data: {
    //               measurementAmount: ingredient.measurement.amount,
    //               measurementUnit: ingredient.measurement.unit,
    //             },
    //           },
    //         },
    //       },
    //       create: {
    //         name: ingredient.name,
    //         publicId: nanoid(),
    //         RecipeIngredient: {
    //           create: {
    //             measurementAmount: ingredient.measurement.amount,
    //             measurementUnit: ingredient.measurement.unit,
    //             recipeId,
    //           },
    //         },
    //       },
    //       include: {
    //         RecipeIngredient: true,
    //       },
    //     })
    //   )
    // );

    // await Promise.all(
    //   recipeDto.ingredients.map((ingredient) =>
    //     tx.recipeIngredient.update({
    //       data: {
    //         recipeId,
    //         measurementAmount: ingredient.measurement.amount,
    //         measurementUnit: ingredient.measurement.unit,
    //         Ingredient: {
    //           connect
    //         }
    //       },
    //     })
    //   )
    // );
  });

  await prisma.recipe.update({
    where: {
      id: recipeId,
    },
    data: {
      name: recipeDto.name,
      totalDuration: recipeDto.totalDuration,
      servings: recipeDto.servings,

      // RecipeStep: {
      //   upsert: recipeDto.steps.map((step, i) => ({
      //     // where: {
      //     //   recipeId_stepId: {
      //     //     recipeId: Number(recipeDto.id),
      //     //     stepId: 1,
      //     //   },
      //     //   // recipeId: Number(recipeDto.id),
      //     //   // stepId: 1,
      //     //   // Step: {
      //     //   //   publicId: step.uuid,
      //     //   // },
      //     // },
      //     create: {
      //       Step: {
      //         description: step.description,
      //         publicId: step.uuid,
      //       },
      //       order: i,
      //     },
      //     update: {
      //       Step: {
      //         description: step.description,
      //       },
      //       order: i,
      //     },
      //   })),
      // },
      // RecipeIngredient: {
      //   create: recipeDto.ingredients.map((ingredient) => ({
      //     Ingredient: {
      //       create: {
      //         name: ingredient.name,
      //         publicId: ingredient.uuid,
      //       },
      //     },
      //     measurementAmount: ingredient.measurement.amount,
      //     measurementUnit: ingredient.measurement.unit,
      //   })),
      // },
    },
  });
}

export { updateRecipeEntity };
