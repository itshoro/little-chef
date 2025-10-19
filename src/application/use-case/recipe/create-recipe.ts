import type { Recipe, RecipeDetail } from "@/domain/recipe/recipe";
import { RecipeCreationError } from "@/application/abstractions/recipe/recipe-creation-error";
import type { RecipePermissionRepository } from "@/application/abstractions/recipe/recipe-permission-repository";
import type { RecipeRepository } from "@/application/abstractions/recipe/recipe-repository";
import type { Step } from "@/domain/recipe/step";
import type { StepRepository } from "@/application/abstractions/recipe/step-repository";
import type { FileStorage } from "@/application/shared/file-storage";
import type { Result } from "@/domain/shared/result";
import type { User } from "@/domain/user/user";
import { nanoid } from "@/lib/nanoid";
import { generateSlug } from "@/lib/slug";
import { makeRevertibleFileReference } from "../../shared/revertible-file-reference";

export interface CreateRecipeDTO {
  cover: File | null;
  recipe: Omit<Recipe, "id" | "publicId" | "cover" | "likes" | "slug">;
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
    await using coverReference = makeRevertibleFileReference(
      dto.cover ? await fileStorage.storeTemporary(nanoid(), dto.cover) : null,
      fileStorage,
    );

    const recipeDto: Omit<Recipe, "id"> = {
      ...dto.recipe,
      publicId: nanoid(),
      cover: coverReference.ref,
      likes: 0,
      slug: generateSlug(dto.recipe.name),
    };

    const recipeResult = await recipeRepository.create(recipeDto);
    if (!recipeResult.ok) return recipeResult;

    const stepsResult = await stepRepository.createSteps(
      recipeResult.value.id,
      dto.steps,
    );
    if (!stepsResult.ok) return stepsResult;

    const permissionResult = await recipePermissionRepository.addPermission(
      recipeResult.value.id,
      user,
      "owner",
    );
    if (!permissionResult.ok) return permissionResult;

    await coverReference.commit();

    const recipeDetail: RecipeDetail = {
      ...recipeResult.value,
      cover: coverReference.ref,
      collaborators: [{ user, role: "owner" }],
      steps: dto.steps,
    };

    return { ok: true, value: recipeDetail };
  };
}
