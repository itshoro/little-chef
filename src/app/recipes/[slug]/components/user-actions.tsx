import type { Recipe } from "@/drizzle/schema";
import { addRecipeLike, isRecipeLiked, removeRecipeLike } from "@/lib/dal/user";
import { revalidatePath } from "next/cache";
import { OptimisticLikeButton } from "../../../components/button/optimistic-like-button";
import { AddToCollectionButton } from "./buttons/add-to-collection-button";

export const LikeButton = async ({
  recipe,
  publicUserId,
  disabled,
}: {
  recipe: Recipe;
  publicUserId: string | undefined;
  disabled?: boolean;
}) => {
  const isLiked = publicUserId
    ? await isRecipeLiked(publicUserId, recipe.id)
    : false;

  return (
    <OptimisticLikeButton
      count={recipe.likes}
      isLiked={isLiked}
      disabled={disabled}
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

export const AddToCollection = async ({
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
