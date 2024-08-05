"use client";

import { useOptimistic, useState } from "react";
import { BaseButton } from "../../../../components/base-button";

type OptimisticLikeButtonProps = {
  count: number;
  isLiked: boolean;
  disabled: boolean;
  action: (
    type: "add" | "remove",
  ) => Promise<{ count: number; isLiked: boolean }>;
};

const OptimisticLikeButton = (props: OptimisticLikeButtonProps) => {
  const [optimisticLikes, dispatchToggleLike] = useOptimisticLikes(
    props.count,
    props.isLiked,
    props.action,
  );

  return (
    <BaseButton
      type="button"
      disabled={!props.disabled || optimisticLikes.pending}
      onClick={async () => {
        await dispatchToggleLike();
      }}
      data-liked={optimisticLikes.isLiked}
      className="data-[liked=true]:bg-neutral-50 data-[liked=true]:text-red-400 data-[liked=true]:shadow-inner"
    >
      <div className="flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="size-4"
        >
          <path d="M2 6.342a3.375 3.375 0 0 1 6-2.088 3.375 3.375 0 0 1 5.997 2.26c-.063 2.134-1.618 3.76-2.955 4.784a14.437 14.437 0 0 1-2.676 1.61c-.02.01-.038.017-.05.022l-.014.006-.004.002h-.002a.75.75 0 0 1-.592.001h-.002l-.004-.003-.015-.006a5.528 5.528 0 0 1-.232-.107 14.395 14.395 0 0 1-2.535-1.557C3.564 10.22 1.999 8.558 1.999 6.38L2 6.342Z" />
        </svg>
        <span className="text-xs font-semibold">{optimisticLikes.count}</span>

        <span className="sr-only">Like</span>
      </div>
    </BaseButton>
  );
};

function useOptimisticLikes(
  count: OptimisticLikeButtonProps["count"],
  isLiked: OptimisticLikeButtonProps["isLiked"],
  action: OptimisticLikeButtonProps["action"],
) {
  const [likes, setLikes] = useState({
    count: count,
    isLiked: isLiked,
    pending: false,
  });

  const [optimisticLikes, setOptimisticLikes] = useOptimistic(
    likes,
    (state, action: "add" | "remove") => {
      switch (action) {
        case "add": {
          return { count: state.count + 1, isLiked: true, pending: true };
        }
        case "remove": {
          return { count: state.count - 1, isLiked: false, pending: true };
        }
      }
    },
  );

  async function dispatch() {
    const actionType = optimisticLikes.isLiked ? "remove" : "add";
    setOptimisticLikes(actionType);
    const serverResult = await action(actionType);
    setLikes({ ...serverResult, pending: false });
  }

  return [optimisticLikes, dispatch] as const;
}

export { OptimisticLikeButton };
