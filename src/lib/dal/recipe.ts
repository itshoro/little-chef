import * as schema from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import type { Visibility } from "./visibility";

// MARK: Preferences

async function getPreferencesId(userId: number) {
  const result = await db
    .select({ recipePreferencesId: schema.users.recipePreferencesId })
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);

  if (result.length === 0) throw new Error("Couldn't find user");
  const [user] = result;

  return user.recipePreferencesId;
}

export async function updateDefaultServingSize(
  userId: number,
  defaultServingSize: number,
) {
  const id = await getPreferencesId(userId);

  await db
    .update(schema.recipePreferences)
    .set({ defaultServingSize })
    .where(eq(schema.recipePreferences.id, id));
}

export async function updateDefaultLanguage(
  userId: number,
  defaultLanguageCode: string,
) {
  const id = await getPreferencesId(userId);

  await db
    .update(schema.recipePreferences)
    .set({ defaultLanguageCode })
    .where(eq(schema.recipePreferences.id, id));
}

export async function updateDefaultVisibility(
  userId: number,
  defaultVisibility: Visibility,
) {
  const id = await getPreferencesId(userId);

  await db
    .update(schema.recipePreferences)
    .set({ defaultVisibility })
    .where(eq(schema.recipePreferences.id, id));
}

// MARK: Actions

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
