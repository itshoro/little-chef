import { getMaintainedCollections } from "@/lib/dal/user";
import { CollectionItem } from "./collection-item";
import { NoCollections } from "@/app/components/fallbacks/collections/no-collections";
import { addRecipe } from "@/lib/dal/collections";

type RootProps = {
  userId: number | undefined;
  recipePublicId: string;
};

const AddRecipeToCollectionServerRoot = async ({
  userId,
  recipePublicId,
}: RootProps) => {
  const collections =
    userId !== undefined ? await getMaintainedCollections(userId) : [];
  if (collections.length === 0) return <NoCollections />;

  return (
    <>
      <div className="text-sm font-medium">Your Collections</div>
      <ul className="mt-2">
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
