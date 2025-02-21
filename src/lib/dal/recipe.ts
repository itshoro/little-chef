import { db } from "@/drizzle/db";
import type { User } from "@/drizzle/schema";
import * as schema from "@/drizzle/schema";
import { and, eq, like, or, sql } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import type { UploadFileResult } from "uploadthing/types";
import { nanoid } from "../nanoid";
import { generateSlug } from "../slug";
import { getUser } from "./user";
import { type Visibility } from "./user/types";

async function getPreferencesId(publicUserId: string) {
  const user = await getUser(publicUserId);
  if (!user) throw new Error("User doesn't exist.", { cause: publicUserId });

  const result = await db
    .select({ recipePreferencesId: schema.users.recipePreferencesId })
    .from(schema.users)
    .where(eq(schema.users.id, user.id))
    .limit(1);

  if (result.length === 0)
    throw new Error("Couldn't find recipe preferences", {
      cause: publicUserId,
    });

  return result[0].recipePreferencesId;
}

export async function getRecipePreferences(publicUserId: string) {
  const id = await getPreferencesId(publicUserId);
  if (!id) throw new Error("Couldn't find recipe preferences");

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
  user: User,
  defaultServingSize: number,
) {
  const id = await getPreferencesId(user.publicId);
  if (!id)
    throw new Error("Couldn't find recipe preferences", {
      cause: user,
    });

  await db
    .update(schema.recipePreferences)
    .set({ defaultServingSize })
    .where(eq(schema.recipePreferences.id, id));
}

export async function updateDefaultVisibility(
  user: User,
  defaultVisibility: Visibility,
) {
  const id = await getPreferencesId(user.publicId);
  if (!id)
    throw new Error("Couldn't find recipe preferences", {
      cause: user,
    });

  await db
    .update(schema.recipePreferences)
    .set({ defaultVisibility })
    .where(eq(schema.recipePreferences.id, id));
}

// MARK: App
export async function createRecipe(dto: {
  name: string;
  cover: { update: false } | { update: true; image: File | null };
  description: string;
  servings: number;
  preparationTime: number;
  cookingTime: number;
  visibility: Visibility;
  step: Record<string, string>;
}) {
  const utapi = new UTApi();

  let coverImage: UploadFileResult | undefined = undefined;
  if (dto.cover.update && dto.cover.image) {
    coverImage = await utapi.uploadFiles(dto.cover.image);
  }

  return await db.transaction(async (tx) => {
    const recipeQuery = await tx
      .insert(schema.recipes)
      .values({
        name: dto.name,
        coverSrc: coverImage?.data?.url,
        description: dto.description,
        publicId: nanoid(),
        recommendedServingSize: dto.servings,
        slug: generateSlug(dto.name),
        visibility: dto.visibility,
        cookingTime: dto.cookingTime,
        preparationTime: dto.preparationTime,
      })
      .returning();

    if (recipeQuery.length !== 1)
      throw new Error("Recipe couldn't be created.", { cause: dto });
    const recipe = recipeQuery.pop() as (typeof recipeQuery)[number];

    await tx.insert(schema.steps).values(
      Object.entries(dto.step).map(([uuid, step], i) => {
        return {
          description: step,
          order: i,
          publicId: uuid,
          recipeId: recipe.id,
        };
      }),
    );

    return recipe;
  });
}

export async function getCreatorsAndMaintainers(recipeId: number) {
  return await db
    .select({
      username: schema.users.username,
      publicId: schema.users.publicId,
      avatar: schema.users.avatar,
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

export async function findPublicRecipeIds(query: string) {
  return await db
    .select({
      id: schema.recipes.id,
      publicId: schema.recipes.publicId,
    })
    .from(schema.recipes)
    .where(
      and(
        like(schema.recipes.name, `%${query}%`),
        eq(schema.recipes.visibility, "public"),
      ),
    )
    .groupBy(query === "" ? sql`random()` : schema.recipes.id);
}

export async function getRecipe(
  query: { id: number } | { publicId: string },
  publicUserId?: string,
) {
  const user = await getUser(publicUserId);

  const recipe = await db
    .select({
      id: schema.recipes.id,
      coverSrc: schema.recipes.coverSrc,
      publicId: schema.recipes.publicId,
      name: schema.recipes.name,
      description: schema.recipes.description,
      recommendedServingSize: schema.recipes.recommendedServingSize,
      slug: schema.recipes.slug,
      preparationTime: schema.recipes.preparationTime,
      cookingTime: schema.recipes.cookingTime,
      visibility: schema.recipes.visibility,
      likes: schema.recipes.likes,
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
          eq(schema.recipes.visibility, "unlisted"),
          user !== undefined
            ? and(
                eq(schema.recipeSubscriptions.userId, user.id),
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
  await db.transaction(async (tx) => {
    const affectedCollections = await tx
      .selectDistinct({ id: schema.collectionRecipes.collectionId })
      .from(schema.collectionRecipes)
      .where(eq(schema.collectionRecipes.recipeId, recipeId))
      .groupBy(schema.collectionRecipes.collectionId);

    await tx.delete(schema.recipes).where(eq(schema.recipes.id, recipeId));

    await Promise.all(
      affectedCollections.map((collection) => {
        return tx
          .update(schema.collections)
          .set({
            itemCount: sql<number>`(
              SELECT CAST(COUNT(${schema.collectionRecipes.recipeId}) AS INT)
              FROM ${schema.collectionRecipes}
              WHERE ${eq(schema.collectionRecipes.collectionId, collection.id)}
            )`,
          })
          .where(eq(schema.collections.id, collection.id));
      }),
    );
  });
}

export async function getRecipeSteps(recipeId: number) {
  return await db
    .select()
    .from(schema.steps)
    .where(eq(schema.steps.recipeId, recipeId))
    .orderBy(schema.steps.order);
}

export async function updateRecipe(
  dto: {
    publicId: string;
    cover: { update: false } | { update: true; image: File | null };
    name: string;
    description: string;
    servings: number;
    preparationTime: number;
    cookingTime: number;
    visibility: Visibility;
    step: Record<string, string>;
  },
  user: User,
) {
  const result = await db
    .select({
      recipeId: schema.recipes.id,
      coverSrc: schema.recipes.coverSrc,
    })
    .from(schema.recipes)
    .where(eq(schema.recipes.publicId, dto.publicId));

  if (result.length !== 1)
    throw new Error("Couldn't find recipe.", {
      cause: { target: "general", publicId: dto.publicId },
    });

  const maintainers = await getCreatorsAndMaintainers(result[0].recipeId);
  if (maintainers.find((maintainer) => maintainer.publicId !== user.publicId))
    throw new Error("You aren't authorized to update this recipe.", {
      cause: { target: "user" },
    });

  const coverUpdate = await updateRecipeCover(dto.cover, result[0].coverSrc);

  return await db.transaction(async (tx) => {
    const recipeQuery = await tx
      .update(schema.recipes)
      .set({
        coverSrc: coverUpdate,
        cookingTime: dto.cookingTime,
        description: dto.description,
        name: dto.name,
        slug: generateSlug(dto.name),
        preparationTime: dto.preparationTime,
        recommendedServingSize: dto.servings,
        visibility: dto.visibility,
      })
      .where(eq(schema.recipes.publicId, dto.publicId))
      .returning();

    if (recipeQuery.length !== 1) {
      throw new Error("Couldn't update recipe.", {
        cause: { target: "general", dto },
      });
    }
    const recipe = recipeQuery.pop() as (typeof recipeQuery)[number];

    await tx.delete(schema.steps).where(eq(schema.steps.recipeId, recipe.id));
    await tx.insert(schema.steps).values(
      Object.entries(dto.step).map(([uuid, step], i) => ({
        description: step,
        publicId: uuid,
        order: i,
        recipeId: recipe.id,
      })),
    );

    return recipe;
  });
}

type CoverUpdate =
  | {
      update: false;
    }
  | {
      update: true;
      image: File | null;
    };

/**
 * @returns `null` or `string` if `currentCoverSrc` should be overriden - `undefined` if `currentCoverSrc` should be retained.
 */
async function updateRecipeCover(
  coverUpdate: CoverUpdate,
  currentCoverSrc: string | undefined | null,
) {
  if (!coverUpdate.update) return undefined;
  // TODO handle partial states, such as delete failing but update working.

  try {
    const utapi = new UTApi();

    const currentFileKey = currentCoverSrc?.split("/").pop();
    const deleteCurrentCover = currentFileKey
      ? utapi.deleteFiles(currentFileKey)
      : Promise.resolve(undefined);

    const uploadCover = coverUpdate.image
      ? utapi.uploadFiles(coverUpdate.image)
      : Promise.resolve(undefined);

    const [uploadedCover, deletionStatus] = await Promise.allSettled([
      uploadCover,
      deleteCurrentCover,
    ]);

    if (
      uploadedCover.status === "fulfilled" &&
      uploadedCover.value?.data?.url
    ) {
      return uploadedCover.value.data.url;
    } else if (
      deletionStatus.status === "fulfilled" &&
      deletionStatus.value?.success
    ) {
      return null;
    }
  } catch {
    return undefined;
  }
}
