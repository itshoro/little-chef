import { getMaintainedCollections } from "@/lib/dal/user";
import { CollectionItem } from "./collection-item";
import { NoCollections } from "@/app/components/fallbacks/collections/no-collections";
import { addRecipe } from "@/lib/dal/collections";

type RootProps = {
  publicUserId: string | undefined;
  recipePublicId: string;
};

const AddRecipeToCollectionServerRoot = async ({
  publicUserId,
  recipePublicId,
}: RootProps) => {
  const collections = await getMaintainedCollections(publicUserId);
  if (collections.length === 0) return <NoCollections />;

  return (
    <>
      <ul className="mt-2 flex flex-col gap-2">
        {collections.map((collection) => (
          <li key={collection.id}>
            <CollectionItem
              name={collection.name}
              addToCollection={async () => {
                "use server";
                await addRecipe(collection.publicId, recipePublicId);
              }}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export { AddRecipeToCollectionServerRoot };
