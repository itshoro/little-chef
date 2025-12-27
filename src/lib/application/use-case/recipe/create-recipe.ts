import type { RecipePermissionRepository } from "@/lib/application/abstractions/recipe/recipe-permission-repository";
import type { RecipeRepository } from "@/lib/application/abstractions/recipe/recipe-repository";
import type { StepRepository } from "@/lib/application/abstractions/recipe/step-repository";
import type { FileStorage } from "@/lib/application/shared/file-storage";
import type { Recipe, RecipeDetail } from "@/lib/domain/recipe/recipe";
import { RecipeCreationError } from "@/lib/domain/recipe/recipe-creation-error";
import type { Step } from "@/lib/domain/recipe/step";
import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";
import { nanoid } from "@/lib/nanoid";
import { generateSlug } from "@/lib/slug";
import { taintObjectReference } from "next/dist/server/app-render/entry-base";
import { makeRevertibleFileReference } from "../../shared/revertible-file-reference";

export interface CreateRecipeDTO {
  cover: File | null;
  recipe: Omit<
    Recipe,
    "id" | "publicId" | "collaborators" | "cover" | "likes" | "slug"
  >;
  steps: Step[];
}

export function makeCreateRecipe(
  fileStorage: FileStorage,
  recipeRepository: RecipeRepository,
  recipePermissionRepository: RecipePermissionRepository,
  stepRepository: StepRepository,
) {
  return async function createRecipe(
    user: User,
    dto: CreateRecipeDTO,
  ): Promise<Result<Recipe, RecipeCreationError>> {
    const tempRefRes = dto.cover
      ? await fileStorage.storeTemporary(nanoid(), dto.cover)
      : null;
    if (tempRefRes && !tempRefRes.ok) return tempRefRes;

    await using revertibleRef = makeRevertibleFileReference(
      tempRefRes?.value ?? null,
      fileStorage,
    );

    const recipeResult = await recipeRepository.create({
      ...dto.recipe,
      publicId: nanoid(),
      cover: revertibleRef.ref,
      likes: 0,
      slug: generateSlug(dto.recipe.name),
    });
    if (!recipeResult.ok) return recipeResult;
    const recipe = recipeResult.value;

    const permissionResult = await recipePermissionRepository.addPermission(
      recipe,
      user,
      "owner",
    );
    if (!permissionResult.ok) return permissionResult;

    const stepsResult = await stepRepository.createSteps(recipe, dto.steps);
    if (!stepsResult.ok) return stepsResult;

    await revertibleRef.commit();

    taintObjectReference(
      "recipe may not be passed over the network boundary, consider calling `toPublicRecipe` first.",
      recipe,
    );

    return { ok: true, value: recipe };
  };
}
