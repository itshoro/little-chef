import type { DrizzleRecipe } from "@/drizzle/schema";
import { addRecipeLike, isRecipeLiked, removeRecipeLike } from "@/lib/dal/user";
import { revalidatePath } from "next/cache";
import { OptimisticLikeButton } from "../../../../components/button/optimistic-like-button";
import { AddToCollectionButton } from "./buttons/add-to-collection-button";

export const LikeButton = async ({
  recipe,
  publicUserId,
  disabled,
  className,
}: {
  className?: string;
  recipe: DrizzleRecipe;
  publicUserId: string | undefined;
  disabled?: boolean;
}) => {
  const isLiked = publicUserId
    ? await isRecipeLiked(publicUserId, recipe.id)
    : false;

  return (
    <OptimisticLikeButton
      className={className}
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
  className,
}: {
  className?: string;
  recipe: DrizzleRecipe;
  publicUserId: string | undefined;
}) => {
  return (
    <AddToCollectionButton
      className={className}
      recipePublicId={recipe.publicId}
      disabled={publicUserId === undefined}
    />
  );
};
