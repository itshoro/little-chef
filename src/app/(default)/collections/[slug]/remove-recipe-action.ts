import type { CollectionIdentifier, RecipeIdentifier } from "@/drizzle/schema";
import { assertAuthenticatedForServerAction } from "@/lib/services/auth";
import { removeRecipeFromCollection } from "@/lib/services/collection";

async function removeRecipeFromCollectionAction(
  collectionIdentifier: CollectionIdentifier,
  recipeIdentifier: RecipeIdentifier,
) {
  "use server";

  const { user } = await assertAuthenticatedForServerAction();
  await removeRecipeFromCollection(
    collectionIdentifier,
    recipeIdentifier,
    user,
  );
}

export { removeRecipeFromCollectionAction };
