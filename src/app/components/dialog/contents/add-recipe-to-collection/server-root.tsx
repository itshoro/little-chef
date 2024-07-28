import { getMaintainedCollections } from "@/lib/dal/user";
import { CollectionItem } from "./collection-item";
import { NoCollections } from "@/app/components/fallbacks/collections/no-collections";
import { addRecipe } from "@/lib/dal/collections";

type RootProps = {
  userId: number;
  recipePublicId: string;
};

const AddRecipeToCollectionServerRoot = async ({
  userId,
  recipePublicId,
}: RootProps) => {
  const collections = await getMaintainedCollections(userId);
  const hasNoCollections = collections.length === 0;

  const addToCollectionWithRecipeId = addToCollection.bind(
    null,
    recipePublicId,
  );

  return (
    <>
      {hasNoCollections ? (
        <NoCollections />
      ) : (
        <>
          <div className="text-sm font-medium">Your Collections</div>
          <ul className="mt-2">
            {collections.map((collection) => (
              <li key={collection.id}>
                <CollectionItem
                  publicId={collection.publicId}
                  name={collection.name}
                  addToCollectionAction={addToCollectionWithRecipeId}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

async function addToCollection(
  recipePublicId: string,
  publicCollectionId: string,
) {
  "use server";

  addRecipe(publicCollectionId, recipePublicId);
}

export { AddRecipeToCollectionServerRoot };
