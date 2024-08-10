import * as schema from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq, or, and, like, sql } from "drizzle-orm";
import { getUser } from "./user";
import {
  AddCollectionValidator,
  UpdateCollectionValidator,
} from "./validators";
import { nanoid } from "../nanoid";
import { generateSlug } from "../slug";
import type { AnyZodObject, z } from "zod";
import type { Visibility } from "./visibility";
import type { User } from "lucia";

async function getPreferencesId(publicUserId: string) {
  const user = await getUser(publicUserId);
  if (!user) throw new Error("User doesn't exist.", { cause: publicUserId });

  const result = await db
    .select({ collectionPreferencesId: schema.users.collectionPreferencesId })
    .from(schema.users)
    .where(eq(schema.users.id, user.id))
    .limit(1);

  if (result.length === 0) {
    throw new Error("Couldn't find collection preferences", {
      cause: publicUserId,
    });
  }

  return user.collectionPreferencesId;
}

export async function getCollectionPreferences(publicUserId: string) {
  const id = await getPreferencesId(publicUserId);

  const result = await db
    .select()
    .from(schema.collectionPreferences)
    .where(eq(schema.collectionPreferences.id, id))
    .limit(1);

  if (result.length === 0) throw new Error("Couldn't find app preferences");
  const [preferences] = result;
  return preferences;
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

export async function updateCollection(
  dto: z.infer<typeof UpdateCollectionValidator>,
  user: User,
) {
  const result = await db
    .select({ recipeId: schema.collections.id })
    .from(schema.collections)
    .where(eq(schema.collections.publicId, dto.publicId));

  if (result.length !== 1)
    throw new Error("Couldn't find collection.", {
      cause: { target: "general", publicId: dto.publicId },
    });

  const maintainers = await getCreatorsAndMaintainers(result[0].recipeId);
  if (maintainers.find((maintainer) => maintainer.publicId !== user.publicId))
    throw new Error("You aren't authorized to update this collection.", {
      cause: { target: "user" },
    });

  const collectionQuery = await db
    .update(schema.collections)
    .set({
      visibility: dto.visibility,
      name: dto.title,
    })
    .where(eq(schema.collections.publicId, dto.publicId))
    .returning();

  if (collectionQuery.length !== 1) {
    throw new Error("Couldn't update collection.", {
      cause: { target: "general", dto },
    });
  }
  return collectionQuery[0];
}

export async function addRecipe(
  // publicUserId: string,
  collectionPublicId: string,
  recipePublicId: string,
) {
  // const sessionResult = await findSessionUser(publicUserId);

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
  await db.transaction(async (tx) => {
    await tx.insert(schema.collectionRecipes).values({
      recipeId,
      collectionId,
    });
    await tx
      .update(schema.collections)
      .set({ itemCount: sql`${schema.collections.itemCount} + 1` })
      .where(eq(schema.collections.id, collectionId));
  });
}

export async function updateDefaultVisibility(
  user: User,
  defaultVisibility: Visibility,
) {
  const id = await getPreferencesId(user.publicId);

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
    .where(
      and(
        like(schema.collections.name, `%${query}%`),
        eq(schema.collections.visibility, "public"),
      ),
    )
    .orderBy(query === "" ? sql`random()` : schema.collections.id);
}

export async function getCollection(
  query: { id: number } | { publicId: string },
  user: User | null,
) {
  const collections = await db
    .select({
      id: schema.collections.id,
      publicId: schema.collections.publicId,
      isCustom: schema.collections.isCustom,
      name: schema.collections.name,
      slug: schema.collections.slug,
      visibility: schema.collections.visibility,
      itemCount: schema.collections.itemCount,
    })
    .from(schema.collections)
    .leftJoin(
      schema.collectionSubscriptions,
      eq(schema.collectionSubscriptions.collectionId, schema.collections.id),
    )
    .where(
      and(
        "id" in query
          ? eq(schema.collections.id, query.id)
          : eq(schema.collections.publicId, query.publicId),
        or(
          eq(schema.collections.visibility, "public"),
          eq(schema.collections.visibility, "unlisted"),
          user !== null
            ? and(
                eq(schema.collectionSubscriptions.userId, user.id),
                or(
                  eq(schema.collectionSubscriptions.role, "creator"),
                  eq(schema.collectionSubscriptions.role, "maintainer"),
                ),
              )
            : undefined,
        ),
      ),
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

export function collectionDtoFromFormData<TValidator extends z.AnyZodObject>(
  formData: FormData,
  validator: TValidator,
) {
  const dto = {
    publicId: formData.get("publicId") ?? undefined,
    title: formData.get("title"),
    visibility: formData.get("visibility"),
  };

  return validator.safeParse(dto) as ReturnType<TValidator["safeParse"]>;
}

export async function deleteCollection(collectionId: number, user: User) {
  const result = await db
    .select()
    .from(schema.collectionSubscriptions)
    .where(
      and(
        or(
          eq(schema.collectionSubscriptions.role, "creator"),
          eq(schema.collectionSubscriptions.role, "maintainer"),
        ),
        eq(schema.collectionSubscriptions.userId, user.id),
        eq(schema.collectionSubscriptions.collectionId, collectionId),
      ),
    );

  if (result.length === 0) throw new Error("Unauthorized.");

  await db
    .delete(schema.collections)
    .where(eq(schema.collections.id, collectionId));
}
