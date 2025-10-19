import type { Recipe } from "@/domain/recipe/recipe";
import type { RecipePermissionRepository } from "@/application/abstractions/recipe/recipe-permission-repository";
import type { RecipeRepository } from "@/application/abstractions/recipe/recipe-repository";
import { RecipeUpdateError } from "@/domain/recipe/recipe-update-error";
import type { Step } from "@/domain/recipe/step";
import type { StepRepository } from "@/application/abstractions/recipe/step-repository";
import type { FileReference } from "@/domain/shared/file-reference";
import type { FileStorage } from "@/application/shared/file-storage";
import type { Result } from "@/domain/shared/result";
import type { User } from "@/domain/user/user";
import { nanoid } from "@/lib/nanoid";
import { generateSlug } from "@/lib/slug";

export interface UpdateRecipeDTO {
  cover: File | null;
  deletePreviousCover: boolean;
  recipe: Omit<Recipe, "id" | "cover" | "likes" | "slug">;
  steps: Step[];
}

export function makeUpdateRecipe(
  fileStorage: FileStorage,
  recipeRepository: RecipeRepository,
  recipePermissionRepository: RecipePermissionRepository,
  stepRepository: StepRepository,
) {
  return async function updateRecipe(
    user: User,
    dto: UpdateRecipeDTO,
  ): Promise<Result<Recipe, RecipeUpdateError>> {
    const recipe = await recipeRepository.findByPublicId(dto.recipe.publicId);
    if (!recipe) {
      return { ok: false, error: new RecipeUpdateError("Recipe not found") };
    }

    if (!(await recipePermissionRepository.canUpdate(recipe.id, user))) {
      return {
        ok: false,
        error: new RecipeUpdateError(
          "User doesn't have permission to update recipe",
          { cause: { userId: user.id, recipeId: recipe.id } },
        ),
      };
    }

    const stepDeleteResult = await stepRepository.deleteStepsForRecipe(
      recipe.id,
    );
    if (!stepDeleteResult.ok) return stepDeleteResult;
    const stepCreateResult = await stepRepository.createSteps(
      recipe.id,
      dto.steps,
    );
    if (!stepCreateResult.ok) return stepCreateResult;

    const coverReference = dto.cover
      ? await fileStorage.storeTemporary(nanoid(), dto.cover)
      : undefined;

    let cover: FileReference | null = null;
    if (coverReference) cover = coverReference;
    else if (dto.deletePreviousCover) cover = null;
    else cover = recipe.cover;

    const recipeDTO: Omit<Recipe, "id" | "publicId" | "likes"> = {
      ...dto.recipe,
      cover,
      slug: generateSlug(dto.recipe.name),
    };

    const recipeResult = await recipeRepository.update(recipe.id, recipeDTO);
    if (!recipeResult.ok) return recipeResult;

    if (dto.deletePreviousCover && recipe.cover) {
      await fileStorage.delete(recipe.cover);
    }
    if (coverReference) await fileStorage.persistReference(coverReference);

    return recipeResult;
  };
}
