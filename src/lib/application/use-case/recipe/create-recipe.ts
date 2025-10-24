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
  ): Promise<Result<RecipeDetail, RecipeCreationError>> {
    await using coverReference = makeRevertibleFileReference(
      dto.cover ? await fileStorage.storeTemporary(nanoid(), dto.cover) : null,
      fileStorage,
    );

    const recipeResult = await recipeRepository.create({
      ...dto.recipe,
      publicId: nanoid(),
      cover: coverReference.ref,
      likes: 0,
      slug: generateSlug(dto.recipe.name),
    });
    if (!recipeResult.ok) return recipeResult;

    const permissionResult = await recipePermissionRepository.addPermission(
      recipeResult.value,
      user,
      "owner",
    );
    if (!permissionResult.ok) return permissionResult;

    const stepsResult = await stepRepository.createSteps(
      permissionResult.value,
      dto.steps,
    );
    if (!stepsResult.ok) return stepsResult;

    await coverReference.commit();

    return stepsResult;
  };
}
