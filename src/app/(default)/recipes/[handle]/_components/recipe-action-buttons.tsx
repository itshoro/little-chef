import { LinkButton } from "@/components/ui/buttons/link-button";
import type { Recipe } from "@/domain/recipe/recipe";
import type { User } from "@/domain/user/user";
import { db } from "@/drizzle/db";
import { DrizzleRecipePermissionRepository } from "@/infrastructure/repositories/drizzle/recipe/recipe-permissions-repository";
import { generateHandle } from "@/lib/slug";
import { AddToCollectionButton } from "./add-to-collection-button";
import { DeleteRecipeButton } from "./delete-button";

interface RecipeActionButtonsProps {
  recipe: Recipe;
  user: User;
}

export const RecipeActionButtons = async ({
  recipe,
  user,
}: RecipeActionButtonsProps) => {
  const recipePermissionRepository = new DrizzleRecipePermissionRepository(db);
  if (!recipePermissionRepository.canUpdate(recipe, user)) return null;

  return (
    <div className="flex gap-2">
      <AddToCollectionButton recipe={recipe} />
      <LinkButton
        variant="outline"
        href={`/recipes/${generateHandle(recipe.slug, recipe.publicId)}/edit`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="size-4 text-stone-600"
        >
          <path
            fillRule="evenodd"
            d="M11.013 2.513a1.75 1.75 0 0 1 2.475 2.474L6.226 12.25a2.751 2.751 0 0 1-.892.596l-2.047.848a.75.75 0 0 1-.98-.98l.848-2.047a2.75 2.75 0 0 1 .596-.892l7.262-7.261Z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-white">Edit</span>
      </LinkButton>

      <DeleteRecipeButton recipeIdentifier={recipe} />
    </div>
  );
};
