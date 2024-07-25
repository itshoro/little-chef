import * as schema from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq, and, like, or } from "drizzle-orm";
import { z } from "zod";
import { type Visibility } from "./visibility";
import { findSessionUser } from "./user";
import { generateSlug } from "../slug";
import { AddRecipeValidator } from "./validators";
import { nanoid } from "../nanoid";

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
export async function createRecipe(dto: z.infer<typeof AddRecipeValidator>) {
  return await db.transaction(async (tx) => {
    const recipe = await tx
      .insert(schema.recipes)
      .values({
        name: dto.name,
        publicId: nanoid(),
        recommendedServingSize: dto.servings,
        slug: generateSlug(dto.name),
        visibility: dto.visibility,
        cookingTime: dto.cookingTime,
        preparationTime: dto.preparationTime,
      })
      .returning();

    if (recipe.length === 0) throw new Error("Recipe couldn't be created.");

    // await tx.insert(schema.ingredientDetails).values(
    //   await Promise.all(
    //     dto.ingredients.map(async (ingredient) => ({
    //       ingredientId: (await byPublicId(ingredient.publicId)).id,
    //       recipeId: recipe[0].id,
    //       measurementAmount: ingredient.measurement.amount,
    //       measurementUnit: ingredient.measurement.unit,
    //     })),
    //   ),
    // );

    return recipe[0];
  });
}

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

export async function getRecipe(
  query: { id: number } | { publicId: string },
  session?: string,
) {
  const sessionResult = session ? await findSessionUser(session) : undefined;

  const recipe = await db
    .select({
      id: schema.recipes.id,
      publicId: schema.recipes.publicId,
      name: schema.recipes.name,
      recommendedServingSize: schema.recipes.recommendedServingSize,
      slug: schema.recipes.slug,
      preparationTime: schema.recipes.preparationTime,
      cookingTime: schema.recipes.cookingTime,
    })
    .from(schema.recipes)
    .leftJoin(
      schema.recipeSubscriptions,
      eq(schema.recipeSubscriptions.recipeId, schema.recipes.id),
    )
    .where(
      and(
        "id" in query
          ? eq(schema.recipes.id, query.id)
          : eq(schema.recipes.publicId, query.publicId),
        or(
          eq(schema.recipes.visibility, "public"),
          sessionResult
            ? and(
                eq(schema.recipeSubscriptions.userId, sessionResult.users.id),
                or(
                  eq(schema.recipeSubscriptions.role, "creator"),
                  eq(schema.recipeSubscriptions.role, "maintainer"),
                ),
              )
            : undefined,
        ),
      ),
    );

  if (recipe.length === 0) {
    throw new Error("Couldn't find the recipe", { cause: query });
  }
  return recipe[0];
}

export async function deleteRecipe(recipeId: number) {
  await db.delete(schema.recipes).where(eq(schema.recipes.id, recipeId));
}


// MARK: Actions

export function recipeDtoFromFormData<TValidator extends z.AnyZodObject>(
  formData: FormData,
  validator: TValidator,
) {
  const stepUuids = formData.getAll("step.uuid");
  const steps = stepUuids.map((uuid) => ({
    uuid,
    description: formData.get(`step.${uuid}`) as string,
  }));

  // const ingredientClientIds = formData.getAll("ingredient.uuid");
  // const ingredients = ingredientClientIds.map((id) => ({
  //   publicId: formData.get(`ingredient.${id}.publicId`),
  //   measurement: {
  //     amount: formData.get(`ingredient.${id}.measurement.amount`),
  //     unit: formData.get(`ingredient.${id}.measurement.unit`),
  //   },
  // }));

  const dto = {
    publicId: formData.get("publicId") ?? undefined,
    name: formData.get("name"),
    servings: formData.get("servings"),
    preparationTime: formData.get("preparationTime"),
    cookingTime: formData.get("cookingTime"),
    visibility: formData.get("visibility"),
    // ingredients,
    steps,
  };

  return validator.safeParse(dto) as ReturnType<TValidator["safeParse"]>;
}
