import "server-only";

import { db } from "@/drizzle/db";
import {
  type DrizzleRecipe,
  type DrizzleRecipeInsert,
  type DrizzleRecipeStepsInsert,
  type DrizzleRecipeUserPermissionInsert,
  type RecipeIdentifier,
} from "@/drizzle/schema";
import type { ListQueryOptions } from "@/lib/dal/utils";
import { RecipeNotFoundError } from "@/lib/errors/resource-not-found/recipe";
import { nanoid } from "@/lib/nanoid";
import { generateSlug } from "@/lib/slug";
import { toIdentifier } from "@/lib/utils/to-identifier";
import { UTApi } from "uploadthing/server";
import {
  unsafeFindCollectionIdsWithRecipe,
  unsafeUpdateCollectionRecipeItemCount,
} from "../../dal/collection";
import {
  unsafeCreateRecipe,
  unsafeCreateRecipeSteps,
  unsafeCreateUserPermissionForRecipe,
  unsafeDeleteRecipe,
  unsafeDeleteRecipeSteps,
  unsafeFindEditableRecipes,
  unsafeFindRecipes,
  unsafeGetMaintainersForRecipe,
  unsafeGetMaintainersForRecipes,
  unsafeGetRecipeByIdentifier,
  unsafeGetRecipeSteps,
  unsafeResolveRecipeId,
  unsafeUpdateRecipe,
} from "../../dal/recipe";
import { createRevertibleUpload } from "../../integrations/uploadthing/revertible-upload";
import { invariant as collectionInvariant } from "../../validators/collection/invariant";
import { invariant as recipeInvariant } from "../../validators/recipe/invariant";
import type { AuthenticatedUser } from "../auth/types";
import { toUserOutputPublicDTO } from "../user/transformer";
import type { UserOutputPublicDTO } from "../user/types";
import {
  assertCanEditRecipe,
  assertCanMaintainRecipe,
  assertCanViewRecipe,
} from "./permissions";
import {
  toRecipeOutputPublicDTO,
  toRecipeStepOutputPublicDTO,
} from "./transformer";
import type {
  RecipeDetailsDTO,
  RecipeInsertDTO,
  RecipePreviewDTO,
  RecipeStepsUpdateDTO,
  RecipeUpdateDTO,
} from "./types";

// MARK: CRUD

export async function createRecipe(
  dto: RecipeInsertDTO,
  user: AuthenticatedUser,
) {
  return await db.transaction(async (tx) => {
    await using uploadResult = await createRevertibleUpload(
      dto.cover.update ? dto.cover.file : null,
    );

    const recipeDto: DrizzleRecipeInsert = {
      name: dto.name,
      slug: generateSlug(dto.name),
      coverSrc: uploadResult?.url ?? null,
      publicId: nanoid(),
      recommendedServingSize: dto.recommendedServingSize,
      visibility: dto.visibility,
      cookingTime: dto.cookingTime,
      description: dto.description,
      preparationTime: dto.preparationTime,
    };

    const recipe = await unsafeCreateRecipe(tx, recipeDto);
    recipeInvariant(recipe, "Failed to create recipe.", {
      cause: {
        recipeDto,
        identifier: {
          user: toIdentifier(user),
        },
      },
    });

    const recipeSteps: RecipeStepsUpdateDTO[] = dto.steps.map(
      (description, i) => ({
        description,
        publicId: nanoid(),
        order: i,
        recipeId: recipe.id,
      }),
    );
    const stepsCreated = (await unsafeCreateRecipeSteps(tx, recipeSteps))
      .rowsAffected;
    recipeInvariant(
      stepsCreated === recipeSteps.length,
      "Failed to create all new recipe steps.",
      {
        cause: {
          identifier: {
            recipe: toIdentifier(recipe),
          },
          expected: recipeSteps.length,
          actual: stepsCreated,
          recipeSteps,
        },
      },
    );

    const userPermissionDto: DrizzleRecipeUserPermissionInsert = {
      recipeId: recipe.id,
      role: "owner",
      userId: user.id,
    };
    const permissionsCreatedResult = await unsafeCreateUserPermissionForRecipe(
      tx,
      userPermissionDto,
    );
    recipeInvariant(
      permissionsCreatedResult.rowsAffected === 1,
      "Failed to create owner permissions.",
      {
        cause: {
          identifier: {
            recipe: toIdentifier(recipe),
            user: toIdentifier(user),
          },
          rowsAffected: permissionsCreatedResult.rowsAffected,
        },
      },
    );

    if (uploadResult) uploadResult.keep();

    return toRecipeOutputPublicDTO(recipe);
  });
}

export async function getRecipeDetailByIdentifier(
  identifier: RecipeIdentifier,
  user: AuthenticatedUser | null,
): Promise<RecipeDetailsDTO> {
  const recipe = await unsafeGetRecipeByIdentifier(identifier);

  if (recipe === null) {
    throw new RecipeNotFoundError(identifier);
  }
  assertCanViewRecipe(recipe, user);

  const [maintainers, steps] = await Promise.all([
    unsafeGetMaintainersForRecipe(recipe),
    unsafeGetRecipeSteps(recipe),
  ]);

  const recipeDTO = toRecipeOutputPublicDTO(recipe);
  const maintainersDTO = maintainers.map((m) =>
    toUserOutputPublicDTO(m.maintainer),
  );
  const recipeStepsDTO = steps.map(toRecipeStepOutputPublicDTO);

  const dto: RecipeDetailsDTO = {
    maintainers: maintainersDTO,
    recipe: recipeDTO,
    steps: recipeStepsDTO,
  };

  return dto;
}

export async function updateRecipe(
  dto: RecipeUpdateDTO,
  user: AuthenticatedUser,
) {
  const recipe = await unsafeGetRecipeByIdentifier(dto);
  if (!recipe) {
    throw new RecipeNotFoundError(toIdentifier(dto));
  }
  assertCanEditRecipe(recipe, user);

  const utapi = new UTApi();
  await db.transaction(async (tx) => {
    await using uploadResult = await createRevertibleUpload(
      dto.cover.update ? dto.cover.file : null,
      utapi,
    );

    const recipeDto: DrizzleRecipeInsert = {
      name: dto.name,
      slug: generateSlug(dto.name),
      publicId: dto.publicId,
      recommendedServingSize: dto.recommendedServingSize,
      visibility: dto.visibility,
      cookingTime: dto.cookingTime,
      coverSrc: dto.cover.update ? (uploadResult?.url ?? null) : undefined,
      description: dto.description,
      preparationTime: dto.preparationTime,
    };

    const updateRecipeResult = await unsafeUpdateRecipe(tx, recipe, recipeDto);
    recipeInvariant(
      updateRecipeResult.rowsAffected === 1,
      "Failed to update recipe.",
      {
        cause: {
          recipeDto,
          identifier: {
            user: toIdentifier(user),
            recipe: toIdentifier(recipe),
          },
          rowsAffected: updateRecipeResult.rowsAffected,
        },
      },
    );

    const deleteRecipeStepsResult = await unsafeDeleteRecipeSteps(tx, recipe);
    recipeInvariant(
      deleteRecipeStepsResult.rowsAffected > 0,
      "Unexpected error deleting existing recipe steps",
      {
        cause: {
          identifier: {
            recipe: toIdentifier(recipe),
          },
          rowsAffected: deleteRecipeStepsResult.rowsAffected,
        },
      },
    );

    const recipeSteps: DrizzleRecipeStepsInsert[] = Object.entries(
      dto.steps,
    ).map(([publicId, description], i) => ({
      description,
      publicId,
      order: i,
      recipeId: recipe.id,
    }));

    const createRecipeStepsResult = await unsafeCreateRecipeSteps(
      tx,
      recipeSteps,
    );
    recipeInvariant(
      createRecipeStepsResult.rowsAffected === recipeSteps.length,
      "Failed to create all new recipe steps.",
      {
        cause: {
          identifier: {
            recipe: toIdentifier(recipe),
          },
          expected: recipeSteps.length,
          actual: createRecipeStepsResult.rowsAffected,
          recipeSteps,
        },
      },
    );

    if (dto.cover.update && recipe.coverSrc) {
      const oldCoverKey = recipe.coverSrc.split("/").at(-1);
      if (oldCoverKey) await utapi.deleteFiles(oldCoverKey);
    }

    if (uploadResult) uploadResult.keep();
  });
}

export async function deleteRecipe(
  identifier: RecipeIdentifier,
  user: AuthenticatedUser,
) {
  const recipeId = await unsafeResolveRecipeId(identifier);
  identifier = { id: recipeId };
  assertCanMaintainRecipe(identifier, user);

  const affectedCollections =
    await unsafeFindCollectionIdsWithRecipe(identifier);
  await db.transaction(async (tx) => {
    const { rowsAffected } = await unsafeDeleteRecipe(tx, identifier);
    recipeInvariant(rowsAffected > 0, "Failed to delete recipe.", {
      cause: { identifier },
    });

    for (const collectionIdentifier of affectedCollections) {
      const updatedCollections = await unsafeUpdateCollectionRecipeItemCount(
        tx,
        collectionIdentifier,
      );
      collectionInvariant(
        updatedCollections.length === 1,
        "Failed to update collection count after recipe deletion.",
        { cause: { collectionIdentifier, identifier, user } },
      );
    }
  });
}

// MARK: List

export async function findRecipes(
  options: ListQueryOptions,
  user: AuthenticatedUser | null,
): Promise<RecipePreviewDTO[]> {
  const recipes = await unsafeFindRecipes(user, options);
  return await mapRecipesWithMaintainers(recipes);
}

export async function findEditableRecipes(
  options: ListQueryOptions,
  user: AuthenticatedUser,
): Promise<RecipePreviewDTO[]> {
  const recipes = await unsafeFindEditableRecipes(user, options);
  return await mapRecipesWithMaintainers(recipes);
}

// MARK: Misc.

export async function mapRecipesWithMaintainers(
  recipes: DrizzleRecipe[],
): Promise<RecipePreviewDTO[]> {
  if (recipes.length === 0) {
    return [];
  }

  const maintainers = await unsafeGetMaintainersForRecipes(recipes);

  const maintainersByRecipeId = new Map<
    DrizzleRecipe["id"],
    UserOutputPublicDTO[]
  >();
  for (const item of maintainers) {
    if (!maintainersByRecipeId.has(item.recipeId)) {
      maintainersByRecipeId.set(item.recipeId, []);
    }

    const currentMaintainers = maintainersByRecipeId.get(item.recipeId)!;
    const containsMaintainer = currentMaintainers.some(
      (m) => m.publicId === item.maintainer.publicId,
    );
    if (!containsMaintainer) {
      currentMaintainers.push(toUserOutputPublicDTO(item.maintainer));
    }
  }

  return recipes.map((recipe) => {
    const recipeDto = toRecipeOutputPublicDTO(recipe);
    const maintainersDto = maintainersByRecipeId.get(recipe.id);
    recipeInvariant(
      maintainersDto && maintainersDto.length > 0,
      "A recipe must have at least one maintainer.",
      {
        cause: {
          identifier: { recipe: { id: recipe.id, publicId: recipe.publicId } },
        },
      },
    );

    return {
      recipe: recipeDto,
      maintainers: maintainersDto,
    } satisfies RecipePreviewDTO;
  });
}
