import * as schema from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq, and, like, or } from "drizzle-orm";
import { z } from "zod";
import type { Visibility } from "./visibility";
import { findSessionUser } from "./user";
import { alias } from "drizzle-orm/sqlite-core";

// MARK: Preferences

async function getPreferencesId(sessionId: string) {
  const sessionResult = await findSessionUser(sessionId);

  const result = await db
    .select({ recipePreferencesId: schema.users.recipePreferencesId })
    .from(schema.users)
    .where(eq(schema.users.id, sessionResult.users.id))
    .limit(1);

  if (result.length === 0) throw new Error("Couldn't find user");
  const [user] = result;

  return user.recipePreferencesId;
}

export async function getRecipePreferences(sessionId: string) {
  const id = await getPreferencesId(sessionId);

  const result = await db
    .select()
    .from(schema.recipePreferences)
    .where(eq(schema.recipePreferences.id, id))
    .limit(1);

  if (result.length === 0) throw new Error("Couldn't find recipe preferences");
  const [preferences] = result;
  return preferences;
}

export async function updateDefaultServingSize(
  sessionId: string,
  defaultServingSize: number,
) {
  const id = await getPreferencesId(sessionId);

  await db
    .update(schema.recipePreferences)
    .set({ defaultServingSize })
    .where(eq(schema.recipePreferences.id, id));
}

export async function updateDefaultVisibility(
  sessionId: string,
  defaultVisibility: Visibility,
) {
  const id = await getPreferencesId(sessionId);

  await db
    .update(schema.recipePreferences)
    .set({ defaultVisibility })
    .where(eq(schema.recipePreferences.id, id));
}

// MARK: App
export async function getSubscriptions(userId: number) {
  return await db
    .select({
      id: schema.recipes.id,
      publicId: schema.recipes.publicId,
      role: schema.recipeSubscriptions.role,
    })
    .from(schema.recipeSubscriptions)
    .where(eq(schema.recipeSubscriptions.userId, userId))
    .innerJoin(
      schema.recipes,
      eq(schema.recipes.id, schema.recipeSubscriptions.recipeId),
    );
}

export async function getCreatorsAndMaintainers(recipeId: number) {
  return await db
    .select({
      username: schema.users.username,
      publicId: schema.users.publicId,
    })
    .from(schema.recipeSubscriptions)
    .where(
      and(
        eq(schema.recipeSubscriptions.recipeId, recipeId),
        or(
          eq(schema.recipeSubscriptions.role, "creator"),
          eq(schema.recipeSubscriptions.role, "maintainer"),
        ),
      ),
    )
    .innerJoin(
      schema.users,
      eq(schema.users.id, schema.recipeSubscriptions.userId),
    );
}

export async function findPublicIds(query: string) {
  return await db
    .select({
      id: schema.recipes.id,
      publicId: schema.recipes.publicId,
    })
    .from(schema.recipes)
    .where(like(schema.recipes.name, `%${query}%`));
}

export async function getRecipe(id: number) {
  const recipe = await db
    .select()
    .from(schema.recipes)
    .where(eq(schema.recipes.id, id));

  if (recipe.length === 0) {
    throw new Error(`Couldn't find a recipe with id ${id}`);
  }
  return recipe[0];
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
