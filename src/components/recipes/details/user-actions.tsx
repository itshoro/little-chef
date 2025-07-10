import { OptimisticLikeButton } from "@/components/ui/buttons/optimistic-like-button";
import type { DrizzleRecipe, RecipeIdentifier } from "@/drizzle/schema";
import type { AuthenticatedUser } from "@/lib/services/auth/types";
import { isRecipeLiked, likeRecipe, unlikeRecipe } from "@/lib/services/recipe";
import { revalidatePath } from "next/cache";
import { AddToCollectionButton } from "./buttons/add-to-collection-button";

export const LikeButton = async ({
  recipeIdentifier,
  user,
  disabled,
  className,
  initialLikes,
}: {
  className?: string;
  recipeIdentifier: RecipeIdentifier;
  initialLikes: number;
  user: AuthenticatedUser | null;
  disabled?: boolean;
}) => {
  const isLiked = user ? await isRecipeLiked(recipeIdentifier, user) : false;

  return (
    <OptimisticLikeButton
      className={className}
      count={initialLikes}
      isLiked={isLiked}
      disabled={disabled}
      action={async (type) => {
        "use server";
        if (!user) throw new Error("No session available");

        if (type === "add") {
          const count = await likeRecipe(recipeIdentifier, user);
          revalidatePath("/recipes", "page");
          return { count, isLiked: true };
        } else {
          const count = await unlikeRecipe(recipeIdentifier, user);
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
