import type { CollectionIdentifier, RecipeIdentifier } from "@/drizzle/schema";
import { assertAuthenticatedForServerAction } from "@/lib/services/auth";
import { removeRecipeFromCollection } from "@/lib/services/collection";
import { revalidatePath } from "next/cache";

async function removeRecipeFromCollectionAction(
  collectionIdentifier: { publicId: string },
  recipeIdentifier: { publicId: string },
) {
  "use server";

  const { user } = await assertAuthenticatedForServerAction();
  await removeRecipeFromCollection(
    collectionIdentifier,
    recipeIdentifier,
    user,
  );

  revalidatePath(`/collections/${collectionIdentifier.publicId}`);
}

export { removeRecipeFromCollectionAction };
