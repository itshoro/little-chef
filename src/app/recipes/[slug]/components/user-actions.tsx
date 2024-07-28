import type { Recipe } from "@/drizzle/schema";
import { OptimisticLikeButton } from "./buttons/optimistic-like-button";
import { addRecipeLike, isRecipeLiked, removeRecipeLike } from "@/lib/dal/user";
import { Session } from "lucia";
import { ShareCurrentPageButton } from "./buttons/share-button";
import { AddToCollectionButton } from "./buttons/add-to-collection-button";
import { AddRecipeToCollectionServerRoot } from "@/app/components/dialog/contents/add-recipe-to-collection/server-root";

const UserActions = async ({
  recipe,
  session,
}: {
  recipe: Recipe;
  session: Session | null;
}) => {
  return (
    <>
      <LikeButton recipe={recipe} session={session} />
      <ShareCurrentPageButton />
      <AddToCollection recipe={recipe} session={session} />
    </>
  );
};

const LikeButton = async ({
  recipe,
  session,
}: {
  recipe: Recipe;
  session: Session | null;
}) => {
  const isLiked = session ? await isRecipeLiked(session.id, recipe.id) : false;

  return (
    <OptimisticLikeButton
      count={recipe.likes}
      isLiked={isLiked}
      disabled={session !== undefined}
      action={async (type) => {
        "use server";
        if (!session) throw new Error("No session available");

        if (type === "add") {
          const count = await addRecipeLike(session.id, recipe.publicId);
          return { count, isLiked: true };
        } else {
          const count = await removeRecipeLike(session.id, recipe.publicId);
          return { count, isLiked: false };
        }
      }}
    />
  );
};

const AddToCollection = async ({
  recipe,
  session,
}: {
  recipe: Recipe;
  session: Session | null;
}) => {
  return (
    <AddToCollectionButton disabled={session === null}>
      <AddRecipeToCollectionServerRoot
        recipePublicId={recipe.publicId}
        userId={session?.userId}
      ></AddRecipeToCollectionServerRoot>
    </AddToCollectionButton>
  );
};

export { UserActions };
