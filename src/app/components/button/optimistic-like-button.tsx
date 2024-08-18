"use client";

import { useMemo, useOptimistic, useTransition } from "react";
import { BaseButton } from "../base-button";

type OptimisticLikeButtonProps = {
  count: number;
  isLiked: boolean;
  disabled: boolean;
  action: (
    type: "add" | "remove",
  ) => Promise<{ count: number; isLiked: boolean }>;
};

const OptimisticLikeButton = (props: OptimisticLikeButtonProps) => {
  const [pending, optimisticLikes, dispatchToggleLike] = useOptimisticLikes(
    props.count,
    props.isLiked,
    props.action,
  );

  return (
    <BaseButton
      type="button"
      disabled={!props.disabled || pending}
      onClick={dispatchToggleLike}
      data-liked={optimisticLikes.isLiked}
      className="relative px-4 data-[liked=true]:border-rose-100 data-[liked=true]:bg-rose-50 data-[liked=true]:text-rose-400 data-[liked=true]:shadow-none dark:data-[liked=true]:border-rose-800 dark:data-[liked=true]:bg-rose-950 dark:data-[liked=true]:text-rose-300"
    >
      <div className="flex items-center gap-1">
        {pending ? (
          <svg className="size-4 animate-spin" viewBox="0 0 20 20">
            <circle
              cy="50%"
              cx="50%"
              r={8}
              strokeWidth={2}
              strokeDasharray={64}
              strokeDashoffset={24}
              fill="transparent"
              stroke="currentColor"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-4"
          >
            <path d="M2 6.342a3.375 3.375 0 0 1 6-2.088 3.375 3.375 0 0 1 5.997 2.26c-.063 2.134-1.618 3.76-2.955 4.784a14.437 14.437 0 0 1-2.676 1.61c-.02.01-.038.017-.05.022l-.014.006-.004.002h-.002a.75.75 0 0 1-.592.001h-.002l-.004-.003-.015-.006a5.528 5.528 0 0 1-.232-.107 14.395 14.395 0 0 1-2.535-1.557C3.564 10.22 1.999 8.558 1.999 6.38L2 6.342Z" />
          </svg>
        )}
        <span className="text-xs font-semibold">{optimisticLikes.count}</span>

        <span className="sr-only">Likes</span>
      </div>
    </BaseButton>
  );
};

function useOptimisticLikes(
  count: OptimisticLikeButtonProps["count"],
  isLiked: OptimisticLikeButtonProps["isLiked"],
  action: OptimisticLikeButtonProps["action"],
) {
  const likes = useMemo(
    () => ({
      count,
      isLiked,
    }),
    [count, isLiked],
  );
  const [optimisticLikes, dispatch] = useOptimistic(
    likes,
    ({ count }, action: "add" | "remove") => {
      if (action === "add") {
        return { isLiked: true, count: count + 1 };
      } else {
        return { isLiked: false, count: count - 1 };
      }
    },
  );
  const [pending, startTransition] = useTransition();

  function dispatchAction() {
    startTransition(async () => {
      const actionType = optimisticLikes.isLiked ? "remove" : "add";
      if (optimisticLikes) dispatch(actionType);
      await new Promise((resolve) =>
        setTimeout(() => resolve(undefined), 1000),
      );
      await action(actionType);
    });
  }

  return [pending, optimisticLikes, dispatchAction] as const;
}

export { OptimisticLikeButton };
