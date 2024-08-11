import type { Recipe } from "@/drizzle/schema";
import { addRecipeLike, isRecipeLiked, removeRecipeLike } from "@/lib/dal/user";
import { revalidatePath } from "next/cache";
import { AddToCollectionButton } from "./buttons/add-to-collection-button";
import { OptimisticLikeButton } from "./buttons/optimistic-like-button";
import { ShareCurrentPageButton } from "./buttons/share-button";

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
          revalidatePath("/recipes", "page");
          return { count, isLiked: true };
        } else {
          const count = await removeRecipeLike(publicUserId, recipe.publicId);
          revalidatePath("/recipes", "page");
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
    <AddToCollectionButton
      recipePublicId={recipe.publicId}
      disabled={publicUserId === undefined}
    />
  );
};

export { UserActions };
