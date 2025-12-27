import { UnauthenticatedError } from "@/lib/domain/auth/unauthenticated-error";
import type { PublicRecipe, Recipe } from "@/lib/domain/recipe/recipe";
import { requireSession } from "@/lib/utils/auth/require-session";

import { removeRecipeFromCollection } from "@/lib/utils/collection/remove-recipe-from-collection";
import { revalidatePath } from "next/cache";

async function removeRecipeFromCollectionAction(
  collectionIdentifier: { publicId: string },
  recipe: PublicRecipe,
) {
  "use server";
  const { user } = await requireSession({
    onUnauthenticated: () => {
      throw new UnauthenticatedError();
    },
  });

  await removeRecipeFromCollection(collectionIdentifier, recipe, user);

  revalidatePath(`/collections/${collectionIdentifier.publicId}`);
}

export { removeRecipeFromCollectionAction };
