import type { RecipeIdentifier } from "@/drizzle/schema";
import { unsafeResolveRecipeId } from "@/lib/dal/recipe";
import type { AuthenticatedUser } from "@/lib/services/auth/types";
import { assertCanEditRecipe } from "@/lib/services/recipe/permissions";
import { AddToCollectionButton } from "./add-to-collection-button";
import { DeleteRecipeButton } from "./delete-button";

interface RecipeActionButtonsProps {
  recipeIdentifier: RecipeIdentifier;
  user: AuthenticatedUser;
}

export const RecipeActionButtons = async ({
  recipeIdentifier,
  user,
}: RecipeActionButtonsProps) => {
  try {
    const id = await unsafeResolveRecipeId(recipeIdentifier);
    await assertCanEditRecipe({ id }, user);
  } catch {
    return null;
  }

  return (
    <div className="flex gap-2">
      <AddToCollectionButton recipeIdentifier={recipeIdentifier} />
      <DeleteRecipeButton recipeIdentifier={recipeIdentifier} />
    </div>
  );
};
