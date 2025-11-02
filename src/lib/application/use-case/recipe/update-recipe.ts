import type { RecipePermissionRepository } from "@/lib/application/abstractions/recipe/recipe-permission-repository";
import type { RecipeRepository } from "@/lib/application/abstractions/recipe/recipe-repository";
import type { StepRepository } from "@/lib/application/abstractions/recipe/step-repository";
import type { FileStorage } from "@/lib/application/shared/file-storage";
import type { Recipe } from "@/lib/domain/recipe/recipe";
import { RecipeUpdateError } from "@/lib/domain/recipe/recipe-update-error";
import type { Step } from "@/lib/domain/recipe/step";
import type { FileReference } from "@/lib/domain/shared/file-reference";
import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";
import { nanoid } from "@/lib/nanoid";
import { generateSlug } from "@/lib/slug";
import { taintObjectReference } from "next/dist/server/app-render/entry-base";

export interface UpdateRecipeDTO {
  cover: File | null;
  deletePreviousCover: boolean;
  recipe: Omit<
    Recipe,
    "id" | "publicId" | "cover" | "likes" | "slug" | "collaborators"
  >;
  steps: Step[];
}

export function makeUpdateRecipe(
  fileStorage: FileStorage,
  recipeRepository: RecipeRepository,
  recipePermissionRepository: RecipePermissionRepository,
  stepRepository: StepRepository,
) {
  return async function updateRecipe(
    recipeIdentifier: { id: Recipe["id"] } | { publicId: Recipe["publicId"] },
    dto: UpdateRecipeDTO,
    user: User,
  ): Promise<Result<Recipe, RecipeUpdateError>> {
    const existingRecipeRes =
      "id" in recipeIdentifier
        ? await recipeRepository.findById(recipeIdentifier.id)
        : await recipeRepository.findByPublicId(recipeIdentifier.publicId);
    if (!existingRecipeRes.ok) return existingRecipeRes;
    const existingRecipe = existingRecipeRes;

    const permissionResult = await recipePermissionRepository.canUpdate(
      existingRecipe.value,
      user,
    );
    if (!permissionResult.ok) return permissionResult;

    const coverReference = dto.cover
      ? await fileStorage.storeTemporary(nanoid(), dto.cover)
      : undefined;
    if (coverReference?.ok === false) return coverReference;

    let cover: FileReference | null = null;
    if (coverReference) cover = coverReference.value;
    else if (dto.deletePreviousCover) cover = null;
    else cover = existingRecipe.value.cover;

    const updateRes = await recipeRepository.update({
      ...dto.recipe,
      cover,
      slug: generateSlug(dto.recipe.name),
      likes: existingRecipe.value.likes,
      id: existingRecipe.value.id,
      publicId: existingRecipe.value.publicId,
    });
    if (!updateRes.ok) return updateRes;
    const recipe = updateRes.value;

    const stepDeleteResult = await stepRepository.deleteStepsForRecipe(recipe);
    if (!stepDeleteResult.ok) return stepDeleteResult;

    const stepCreateResult = await stepRepository.createSteps(
      recipe,
      dto.steps,
    );
    if (!stepCreateResult.ok) return stepCreateResult;

    if (dto.deletePreviousCover && existingRecipe.value.cover) {
      const deletePrevRes = await fileStorage.delete(
        existingRecipe.value.cover,
      );
      if (!deletePrevRes.ok) return deletePrevRes;
    }
    if (coverReference?.ok === true) {
      const persistRes = await fileStorage.persistReference(
        coverReference.value,
      );
      if (!persistRes.ok) return persistRes;
    }

    taintObjectReference(
      "recipes may not be passed over the network boundary, consider calling `toPublicRecipe` first.",
      recipe,
    );

    return { ok: true, value: recipe };
  };
}
