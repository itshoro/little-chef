import type { Prisma, User } from "@prisma/client";
import { getPrisma } from "../prisma";
import { z } from "zod";
import { nanoid } from "../nanoid";

// MARK: Preferences

export async function getRecipePreferences(userId?: User["id"]) {
  if (userId === undefined) return undefined;

  await using connection = getPrisma();
  const prisma = connection.prisma;

  return (
    (await prisma.recipePreferences.findFirst({ where: { userId } })) ??
    undefined
  );
}

export async function updateDefaultServingSize(
  userId: User["id"],
  servingSize: number,
) {
  await using connection = getPrisma();
  const prisma = connection.prisma;

  await prisma.recipePreferences.update({
    data: {
      defaultServingSize: servingSize,
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

  await prisma.recipePreferences.update({
    data: {
      defaultLanguageCode: languageCode,
    },
    where: { userId },
  });
}

const supportedVisibilites = ["public", "unlisted", "private"] as const;
export type Visibility = (typeof supportedVisibilites)[number];

export const validateVisibility = (
  visibility: any,
): visibility is Visibility => {
  return supportedVisibilites.includes(visibility);
};

export async function updateDefaultVisibility(
  userId: User["id"],
  visibility: Visibility,
) {
  await using connection = getPrisma();
  const prisma = connection.prisma;

  await prisma.recipePreferences.update({
    data: {
      defaultVisibility: visibility,
    },
    where: { userId },
  });
}

// MARK: Actions

export async function createRecipe(
  recipeDto: z.infer<typeof AddRecipeValidator>,
) {
  await using connection = getPrisma();
  const prisma = connection.prisma;

  await prisma.recipe.create({
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

export async function updateRecipe(
  recipeDto: z.infer<typeof UpdateRecipeValidator>,
) {
  await using connection = getPrisma();
  const prisma = connection.prisma;

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

  // TODO: Upsert (Recipe)Ingredients
  await prisma.$transaction(async (tx) => {});

  await prisma.recipe.update({
    where: {
      id: recipeId,
    },
    data: {
      name: recipeDto.name,
      totalDuration: recipeDto.totalDuration,
      servings: recipeDto.servings,
    },
  });
}

export function recipeDtoFromFormData<TValidator extends z.AnyZodObject>(
  formData: FormData,
  validator: TValidator,
) {
  const ingredientClientIds = formData.getAll("ingredient.uuid");
  const ingredients = ingredientClientIds.map((id) => ({
    publicId: formData.get(`ingredient.${id}.publicId`),
    measurement: {
      amount: formData.get(`ingredient.${id}.measurement.amount`),
      unit: formData.get(`ingredient.${id}.measurement.unit`),
    },
  }));

  const stepUuids = formData.getAll("step.uuid");
  const steps = stepUuids.map((uuid) => ({
    uuid,
    description: formData.get(`step.${uuid}`),
  }));

  const dto = {
    publicId: formData.get("publicId") ?? undefined,
    name: formData.get("name"),
    servings: formData.get("servings"),
    totalDuration: formData.get("totalDuration"),
    ingredients,
    steps,
  };

  return validator.safeParse(dto) as ReturnType<TValidator["safeParse"]>;
}

const AddRecipeValidator = z.object({
  name: z.string().trim().min(2),
  totalDuration: z.string().regex(/\d{2}:\d{2}/),
  servings: z.coerce.number().min(0),
  ingredients: z.array(
    z.object({
      publicId: z.string(),
      measurement: z.object({
        amount: z.string(),
        unit: z.string(),
      }),
    }),
  ),
  steps: z.array(
    z.object({
      uuid: z.string(),
      description: z.string().max(255),
    }),
  ),
});

const UpdateRecipeValidator = AddRecipeValidator.merge(
  z.object({
    publicId: z.string(),
  }),
);

type Recipe = z.infer<typeof UpdateRecipeValidator>;
