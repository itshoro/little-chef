import { OptimisticLikeButton } from "@/components/ui/buttons/optimistic-like-button";
import { UnauthenticatedError } from "@/lib/domain/auth/unauthenticated-error";
import { toPublicRecipe, type Recipe } from "@/lib/domain/recipe/recipe";
import { toPublicUser, type User } from "@/lib/domain/user/user";
import { requireSession } from "@/lib/utils/auth/require-session";
import {
  isRecipeLiked,
  likeRecipe,
  unlikeRecipe,
} from "@/lib/utils/recipe/like-recipe";
import { revalidatePath } from "next/cache";

export const LikeButton = async ({
  recipe,
  user,
  className,
  initialLikes,
}: {
  className?: string;
  recipe: Recipe;
  initialLikes: number;
  user: User | null;
}) => {
  let isLiked = false;
  if (user) {
    const likeRes = await isRecipeLiked(recipe, user);
    if (!likeRes.ok) throw likeRes.error; // todo: disable button on error?
    isLiked = likeRes.value;
  }

  const publicUser = user ? toPublicUser(user) : null;
  const publicRecipe = toPublicRecipe(recipe);

  const toggleLikeAction = publicUser
    ? async (type: "add" | "remove") => {
        "use server";
        const { user } = await requireSession({
          onUnauthenticated: () => {
            throw new UnauthenticatedError();
          },
        });

        if (type === "add") {
          await likeRecipe(publicRecipe, user);
          revalidatePath("/recipes", "page");
          return { count: initialLikes + 1, isLiked: true };
        } else {
          await unlikeRecipe(publicRecipe, user);
          revalidatePath("/recipes", "page");
          return { count: initialLikes, isLiked: false };
        }
      }
    : undefined;

  return (
    <OptimisticLikeButton
      className={className}
      count={initialLikes}
      isLiked={isLiked}
      disabled={toggleLikeAction === null}
      action={toggleLikeAction}
    />
  );
};
