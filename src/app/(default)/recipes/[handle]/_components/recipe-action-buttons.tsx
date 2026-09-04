import { LinkButton } from "@/components/ui/buttons/link-button";
import { db } from "@/drizzle/db";
import { toPublicRecipe, type Recipe } from "@/lib/domain/recipe/recipe";
import type { User } from "@/lib/domain/user/user";
import { DrizzleRecipePermissionRepository } from "@/lib/infrastructure/repositories/drizzle/recipe/recipe-permissions-repository";
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
        <span>Edit</span>
      </LinkButton>
      <LinkButton
        variant="outline"
        href={`/recipes/${generateHandle(recipe.slug, recipe.publicId)}/permissions`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="size-4 text-stone-600"
        >
          <path d="M8.5 4.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10.9 12.006c.11.542-.348.994-.9.994H2c-.553 0-1.01-.452-.902-.994a5.002 5.002 0 0 1 9.803 0ZM14.002 12h-1.59a2.556 2.556 0 0 0-.04-.29 6.476 6.476 0 0 0-1.167-2.603 3.002 3.002 0 0 1 3.633 1.911c.18.522-.283.982-.836.982ZM12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        </svg>
        Change User Permissions
      </LinkButton>
      <DeleteRecipeButton recipeIdentifier={toPublicRecipe(recipe)} />
    </div>
  );
};
