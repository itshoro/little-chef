import "server-only";

import { db } from "@/drizzle/db";
import {
  type CollectionIdentifier,
  type DrizzleCollection,
  type DrizzleCollectionInsert,
  type DrizzleCollectionUserPermissionInsert,
  type IdentifiedById,
  type RecipeIdentifier,
} from "@/drizzle/schema";
import {
  unsafeAddRecipe,
  unsafeCreateCollection,
  unsafeCreateUserPermissionsForCollection,
  unsafeDeleteCollection,
  unsafeFindEditableCollections,
  unsafeGetCollectionByIdentifier,
  unsafeGetCollections,
  unsafeGetMaintainersForCollection,
  unsafeGetMaintainersForCollections,
  unsafeGetRecipesForCollection,
  unsafeRemoveRecipe,
  unsafeResolveCollectionId,
  unsafeUpdateCollection,
  unsafeUpdateCollectionRecipeItemCount,
} from "@/lib/dal/collection";
import { unsafeResolveRecipeId } from "@/lib/dal/recipe";
import type { ListQueryOptions } from "@/lib/dal/utils";
import { CollectionNotFoundError } from "@/lib/errors/resource-not-found/collection";
import { nanoid } from "@/lib/nanoid";
import { generateSlug } from "@/lib/slug";
import { toIdentifier } from "@/lib/utils/to-identifier";
import { invariant as collectionInvariant } from "@/lib/validators/collection/invariant";
import type { AuthenticatedUser } from "../auth/types";
import { mapRecipesWithMaintainers } from "../recipe";
import { assertCanViewRecipe } from "../recipe/permissions";
import { toUserOutputPublicDTO } from "../user/transformer";
import type { UserOutputPublicDTO } from "../user/types";
import {
  assertCanEditCollection,
  assertCanMaintainCollection,
  assertCanViewCollection,
} from "./permissions";
import { toCollectionOutputPublicDTO } from "./transformer";
import type {
  CollectionDetailsDTO,
  CollectionInsertDTO,
  CollectionPreviewDTO,
  CollectionUpdateDTO,
} from "./types";

// MARK: CRUD
export async function createCollection(
  dto: CollectionInsertDTO,
  user: AuthenticatedUser,
) {
  const collectionDto: DrizzleCollectionInsert = {
    name: dto.name,
    slug: generateSlug(dto.name),
    publicId: nanoid(),
    visibility: dto.visibility,
    isCustom: dto.isCustom,
  };

  const collection = await db.transaction(async (tx) => {
    const collection = await unsafeCreateCollection(tx, collectionDto);
    collectionInvariant(collection, "Failed to create collection.", {
      cause: { collectionDto },
    });

    const userPermissionDto: DrizzleCollectionUserPermissionInsert = {
      collectionId: collection.id,
      role: "owner",
      userId: user.id,
    };
    const userPermissionResult = await unsafeCreateUserPermissionsForCollection(
      tx,
      userPermissionDto,
    );
    collectionInvariant(
      userPermissionResult.rowsAffected === 1,
      "Failed to create owner permissions.",
      {
        cause: {
          identifier: {
            collection: toIdentifier(collection),
            user: toIdentifier(user),
          },
          rowsAffected: userPermissionResult.rowsAffected,
        },
      },
    );

    return collection;
  });

  return toCollectionOutputPublicDTO(collection);
}

export async function getCollectionPreviewByIdentifier(
  identifier: CollectionIdentifier,
  user: AuthenticatedUser | null,
): Promise<CollectionPreviewDTO> {
  const collection = await unsafeGetCollectionByIdentifier(identifier);
  if (!collection) {
    throw new CollectionNotFoundError(toIdentifier(identifier));
  }
  await assertCanViewCollection(collection, user);

  const maintainers = await unsafeGetMaintainersForCollection(collection);
  const collectionDto = toCollectionOutputPublicDTO(collection);
  const maintainersDto = maintainers.map((m) =>
    toUserOutputPublicDTO(m.maintainer),
  );

  const dto: CollectionPreviewDTO = {
    collection: collectionDto,
    maintainers: maintainersDto,
  };

  return dto;
}

export async function getCollectionDetailByIdentifier(
  identifier: CollectionIdentifier,
  user: AuthenticatedUser | null,
): Promise<CollectionDetailsDTO> {
  const collection = await unsafeGetCollectionByIdentifier(identifier);
  if (!collection) {
    throw new CollectionNotFoundError(toIdentifier(identifier));
  }
  await assertCanViewCollection(collection, user);

  const [maintainers, recipes] = await Promise.all([
    unsafeGetMaintainersForCollection(collection),
    getRecipesForCollection(collection, user),
  ]);

  const collectionDto = toCollectionOutputPublicDTO(collection);
  const maintainersDto = maintainers.map((m) =>
    toUserOutputPublicDTO(m.maintainer),
  );

  const dto: CollectionDetailsDTO = {
    collection: collectionDto,
    maintainers: maintainersDto,
    recipes,
  };

  return dto;
}

export async function updateCollection(
  dto: CollectionUpdateDTO,
  user: AuthenticatedUser,
) {
  const collection = await unsafeGetCollectionByIdentifier(dto);
  if (!collection) {
    throw new CollectionNotFoundError(toIdentifier(dto));
  }

  assertCanEditCollection(collection, user);

  const collectionDto: DrizzleCollectionInsert = {
    name: dto.name,
    slug: generateSlug(dto.name),
    publicId: dto.publicId,
    visibility: dto.visibility,
  };

  return await db.transaction(async (tx) => {
    const updateResult = await unsafeUpdateCollection(
      tx,
      collection,
      collectionDto,
    );
    collectionInvariant(
      updateResult.length === 1,
      "Updated an unexpected number of collections.",
      {
        cause: {
          collectionDto,
          identifier: {
            user: { id: user.id, publicId: user.publicId },
            collection: { id: collection.id, publicId: collection.publicId },
          },
          rowsAffected: updateResult.length,
        },
      },
    );

    return updateResult[0];
  });
}

export async function deleteCollection(
  identifier: CollectionIdentifier,
  user: AuthenticatedUser,
) {
  const collectionId = await unsafeResolveCollectionId(identifier);
  identifier = { id: collectionId };
  await assertCanMaintainCollection(identifier, user);

  await db.transaction(async (tx) => {
    const { rowsAffected } = await unsafeDeleteCollection(tx, identifier);
    collectionInvariant(rowsAffected === 1, "Failed to delete collection.", {
      cause: {
        identifier: {
          collection: identifier,
        },
        rowsAffected,
      },
    });
  });
}

// MARK: List
export async function findCollections(
  options: ListQueryOptions,
  user: AuthenticatedUser | null,
): Promise<CollectionPreviewDTO[]> {
  const collections = await unsafeGetCollections(user, options);
  return await mapCollectionsWithMaintainers(collections);
}

export async function findEditableCollections(
  user: AuthenticatedUser,
  options: ListQueryOptions,
): Promise<CollectionPreviewDTO[]> {
  const collections = await unsafeFindEditableCollections(user, options);
  return await mapCollectionsWithMaintainers(collections);
}

// MARK: Collection Recipes

export async function getRecipesForCollection(
  collectionIdentifier: IdentifiedById<DrizzleCollection>,
  user: AuthenticatedUser | null,
) {
  const accessibleRecipes = await unsafeGetRecipesForCollection(
    collectionIdentifier,
    user,
  );

  if (accessibleRecipes.length === 0) {
    return [];
  }

  const recipesWithMaintainers =
    await mapRecipesWithMaintainers(accessibleRecipes);
  return recipesWithMaintainers;
}

export async function addRecipeToCollection(
  collectionIdentifier: CollectionIdentifier,
  recipeIdentifier: CollectionIdentifier,
  user: AuthenticatedUser,
) {
  const [collection, recipeId] = await Promise.all([
    unsafeGetCollectionByIdentifier(collectionIdentifier),
    unsafeResolveRecipeId(recipeIdentifier),
  ]);
  recipeIdentifier = { id: recipeId };

  if (!collection) {
    throw new CollectionNotFoundError(toIdentifier(collectionIdentifier));
  }

  await Promise.all([
    assertCanMaintainCollection(collection, user),
    assertCanViewRecipe(recipeIdentifier, user),
  ]);

  await db.transaction(async (tx) => {
    const { rowsAffected } = await unsafeAddRecipe(
      tx,
      collection,
      recipeIdentifier,
    );
    collectionInvariant(
      rowsAffected === 1,
      "Failed to add recipe to collection.",
      {
        cause: {
          identifier: {
            collection: toIdentifier(collection),
            recipe: recipeIdentifier,
          },
          rowsAffected,
        },
      },
    );

    const updatedCollections = await unsafeUpdateCollectionRecipeItemCount(
      tx,
      collection,
    );
    collectionInvariant(
      updatedCollections.length === 1,
      "Updated item count of an unexpected number of collections",
      {
        cause: {
          identifier: {
            collection: toIdentifier(collection),
            recipe: recipeIdentifier,
          },
        },
      },
    );
    collectionInvariant(
      updatedCollections[0]?.itemCount === collection.itemCount + 1,
      "Failed to update collection item count to expected value",
      {
        cause: {
          identifier: {
            collection: toIdentifier(collection),
            recipe: recipeIdentifier,
          },
          expected: collection.itemCount + 1,
          actual: updatedCollections[0]?.itemCount ?? null,
        },
      },
    );
  });
}

export async function removeRecipeFromCollection(
  collectionIdentifier: CollectionIdentifier,
  recipeIdentifier: RecipeIdentifier,
  user: AuthenticatedUser,
) {
  const [collection, recipeId] = await Promise.all([
    unsafeGetCollectionByIdentifier(collectionIdentifier),
    unsafeResolveRecipeId(recipeIdentifier),
  ]);
  recipeIdentifier = { id: recipeId };

  if (!collection) {
    throw new CollectionNotFoundError(collectionIdentifier);
  }

  assertCanMaintainCollection(collection, user);
  assertCanViewRecipe(recipeIdentifier, user);

  await db.transaction(async (tx) => {
    await unsafeRemoveRecipe(tx, collection, recipeIdentifier);
    const updatedCollections = await unsafeUpdateCollectionRecipeItemCount(
      tx,
      collection,
    );
    collectionInvariant(
      updatedCollections.length === 1,
      "Updated item count of an unexpected number of collections",
      {
        cause: {
          identifier: {
            collection: toIdentifier(collection),
            recipe: recipeIdentifier,
          },
        },
      },
    );
    collectionInvariant(
      updatedCollections[0]?.itemCount === collection.itemCount - 1,
      "Failed to update collection item count to expected value",
      {
        cause: {
          identifier: {
            collection: toIdentifier(collection),
            recipe: recipeIdentifier,
          },
          expected: collection.itemCount + 1,
          actual: updatedCollections[0]?.itemCount ?? null,
        },
      },
    );
  });
}

// MARK: Misc.

export async function mapCollectionsWithMaintainers(
  collections: DrizzleCollection[],
): Promise<CollectionPreviewDTO[]> {
  if (collections.length === 0) {
    return [];
  }

  const collectionIds = collections.map((collection) => collection.id);
  const allMaintainers =
    await unsafeGetMaintainersForCollections(collectionIds);

  const maintainersByCollectionId = new Map<
    DrizzleCollection["id"],
    UserOutputPublicDTO[]
  >();
  for (const item of allMaintainers) {
    if (!maintainersByCollectionId.has(item.collectionId)) {
      maintainersByCollectionId.set(item.collectionId, []);
    }

    const currentMaintainers = maintainersByCollectionId.get(
      item.collectionId,
    )!;
    const containsMaintainer = currentMaintainers.some(
      (m) => m.publicId === item.maintainer.publicId,
    );
    if (!containsMaintainer) {
      currentMaintainers.push(toUserOutputPublicDTO(item.maintainer));
    }
  }

  return collections.map((collection) => {
    const collectionDto = toCollectionOutputPublicDTO(collection);
    const maintainersDto = maintainersByCollectionId.get(collection.id);
    collectionInvariant(
      maintainersDto && maintainersDto.length > 0,
      "A collection must have at least one maintainer.",
      {
        cause: {
          identifier: {
            collection: { id: collection.id, publicId: collection.publicId },
          },
        },
      },
    );

    return {
      collection: collectionDto,
      maintainers: maintainersDto,
    };
  });
}
