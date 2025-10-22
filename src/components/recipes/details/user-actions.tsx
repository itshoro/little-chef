import { OptimisticLikeButton } from "@/components/ui/buttons/optimistic-like-button";
import type { User } from "@/domain/user/user";
import type { RecipeIdentifier } from "@/drizzle/schema";
import {
  isRecipeLiked,
  likeRecipe,
  unlikeRecipe,
} from "@/lib/utils/recipe/like-recipe";
import { revalidatePath } from "next/cache";

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
  user: User | null;
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
          await likeRecipe(recipeIdentifier, user);
          revalidatePath("/recipes", "page");
          return { count: initialLikes + 1, isLiked: true };
        } else {
          await unlikeRecipe(recipeIdentifier, user);
          revalidatePath("/recipes", "page");
          return { count: initialLikes, isLiked: false };
        }
      }}
    />
  );
};
