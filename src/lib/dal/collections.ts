import * as schema from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq, or, and, like } from "drizzle-orm";
import type { Visibility } from "./visibility";
import { findSessionUser } from "./user";
import type { AnyZodObject, TypeOf, z } from "zod";
import { AddCollectionValidator } from "./validators";
import { nanoid } from "../nanoid";
import { generateSlug } from "../slug";

export async function getCollectionPreferences(sessionId: string) {
  const id = await getPreferencesId(sessionId);

  const result = await db
    .select()
    .from(schema.collectionPreferences)
    .where(eq(schema.collectionPreferences.id, id))
    .limit(1);

  if (result.length === 0) throw new Error("Couldn't find app preferences");
  const [preferences] = result;
  return preferences;
}

export async function getPreferencesId(sessionId: string) {
  const sessionResult = await findSessionUser(sessionId);

  const result = await db
    .select({ collectionPreferencesId: schema.users.collectionPreferencesId })
    .from(schema.users)
    .where(eq(schema.users.id, sessionResult.sessions.userId))
    .limit(1);

  if (result.length === 0) throw new Error("Couldn't find user");
  const [user] = result;

  return user.collectionPreferencesId;
}

export async function createCollection(
  dto: z.infer<typeof AddCollectionValidator>,
) {
  const collectionQuery = await db
    .insert(schema.collections)
    .values({
      name: dto.title,
      slug: generateSlug(dto.title),
      visibility: dto.visibility,
      publicId: nanoid(),
      isCustom: true,
      itemCount: 0,
    })
    .returning();

  if (collectionQuery.length !== 1) {
    throw new Error("Couldn't create collection.", { cause: dto });
  }

  return collectionQuery.pop() as (typeof collectionQuery)[number];
}

export async function addRecipe(
  // sessionId: string,
  collectionPublicId: string,
  recipePublicId: string,
) {
  // const sessionResult = await findSessionUser(sessionId);

  const [collectionIdResult, recipeIdResult] = await Promise.all([
    db
      .select({ id: schema.collections.id })
      .from(schema.collections)
      .where(eq(schema.collections.publicId, collectionPublicId)),
    db
      .select({ id: schema.recipes.id })
      .from(schema.recipes)
      .where(eq(schema.recipes.publicId, recipePublicId)),
  ]);

  if (collectionIdResult.length < 1) {
    throw new Error("Collection couldn't be found", {
      cause: collectionPublicId,
    });
  }

  if (recipePublicId.length < 1) {
    throw new Error("Recipe couldn't be found", {
      cause: recipePublicId,
    });
  }

  const recipeId = recipeIdResult[0].id;
  const collectionId = collectionIdResult[0].id;

  // TODO: Validate whether user has sufficient access rights to add recipe to collection.
  await db.insert(schema.collectionRecipes).values({
    recipeId,
    collectionId,
  });
}

export async function updateDefaultVisibility(
  sessionId: string,
  defaultVisibility: Visibility,
) {
  const id = await getPreferencesId(sessionId);

  await db
    .update(schema.collectionPreferences)
    .set({ defaultVisibility })
    .where(eq(schema.collectionPreferences.id, id));
}

export async function getCreatorsAndMaintainers(collectionId: number) {
  return await db
    .select({
      username: schema.users.username,
      publicId: schema.users.publicId,
    })
    .from(schema.collectionSubscriptions)
    .where(
      and(
        eq(schema.collectionSubscriptions.collectionId, collectionId),
        or(
          eq(schema.collectionSubscriptions.role, "creator"),
          eq(schema.collectionSubscriptions.role, "maintainer"),
        ),
      ),
    )
    .innerJoin(
      schema.users,
      eq(schema.users.id, schema.collectionSubscriptions.userId),
    );
}

export async function getSubscriptions(userId: number) {
  return await db
    .select({
      id: schema.collections.id,
      publicId: schema.collections.publicId,
      role: schema.collectionSubscriptions.role,
    })
    .from(schema.collectionSubscriptions)
    .where(eq(schema.collectionSubscriptions.userId, userId))
    .innerJoin(
      schema.collections,
      eq(schema.collections.id, schema.collectionSubscriptions.collectionId),
    );
}

export async function findPublicCollections(query: string) {
  return await db
    .select({
      id: schema.collections.id,
      publicId: schema.collections.publicId,
      value: schema.collections.name,
      slug: schema.collections.slug,
    })
    .from(schema.collections)
    .where(like(schema.collections.name, `%${query}%`));
}

export async function getCollection(
  query: { id: number } | { publicId: string },
) {
  const collections = await db
    .select()
    .from(schema.collections)
    .where(
      "id" in query
        ? eq(schema.collections.id, query.id)
        : eq(schema.collections.publicId, query.publicId),
    );

  if (collections.length === 0) {
    throw new Error(
      `Couldn't find a collection with query ${JSON.stringify(query)}.`,
    );
  }
  return collections[0];
}

export async function getRecipeIds(collectionId: number) {
  // TODO: consider recipe visibility
  return await db
    .select({ id: schema.recipes.id, publicId: schema.recipes.publicId })
    .from(schema.collectionRecipes)
    .where(eq(schema.collectionRecipes.collectionId, collectionId))
    .innerJoin(
      schema.recipes,
      eq(schema.recipes.id, schema.collectionRecipes.recipeId),
    );
}

export function collectionDtoFromFormData<TValidator extends AnyZodObject>(
  formData: FormData,
  validator: TValidator,
) {
  const dto = {
    title: formData.get("title"),
    visibility: formData.get("visibility"),
  };

  return validator.safeParse(dto) as ReturnType<
    (typeof validator)["safeParse"]
  >;
}
