import type { Recipe } from "@/drizzle/schema";
import { OptimisticLikeButton } from "./buttons/optimistic-like-button";
import { addRecipeLike, isRecipeLiked, removeRecipeLike } from "@/lib/dal/user";
import { ShareCurrentPageButton } from "./buttons/share-button";
import { AddToCollectionButton } from "./buttons/add-to-collection-button";
import { AddRecipeToCollectionServerRoot } from "@/app/components/dialog/contents/add-recipe-to-collection/server-root";

const UserActions = async ({
  recipe,
  publicUserId,
}: {
  recipe: Recipe;
  publicUserId: string | undefined;
}) => {
  return (
    <>
      <LikeButton recipe={recipe} publicUserId={publicUserId} />
      <AddToCollection recipe={recipe} publicUserId={publicUserId} />
      <ShareCurrentPageButton />
    </>
  );
};

const LikeButton = async ({
  recipe,
  publicUserId,
}: {
  recipe: Recipe;
  publicUserId: string | undefined;
}) => {
  const isLiked = publicUserId
    ? await isRecipeLiked(publicUserId, recipe.id)
    : false;

  return (
    <OptimisticLikeButton
      count={recipe.likes}
      isLiked={isLiked}
      disabled={publicUserId !== undefined}
      action={async (type) => {
        "use server";
        if (!publicUserId) throw new Error("No session available");

        if (type === "add") {
          const count = await addRecipeLike(publicUserId, recipe.publicId);
          return { count, isLiked: true };
        } else {
          const count = await removeRecipeLike(publicUserId, recipe.publicId);
          return { count, isLiked: false };
        }
      }}
    />
  );
};

const AddToCollection = async ({
  recipe,
  publicUserId,
}: {
  recipe: Recipe;
  publicUserId: string | undefined;
}) => {
  return (
    <AddToCollectionButton disabled={publicUserId === undefined}>
      <AddRecipeToCollectionServerRoot
        recipePublicId={recipe.publicId}
        publicUserId={publicUserId}
      ></AddRecipeToCollectionServerRoot>
    </AddToCollectionButton>
  );
};

export { UserActions };
