"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";

const SubmitWithPending = ({
  children,
  disabled,
  ...props
}: ComponentProps<"button">) => {
  const { pending } = useFormStatus();
  return (
    <button disabled={disabled || pending} {...props} type="submit">
      <div className="flex items-center gap-2">
        {pending && (
          <svg
            viewBox="0 0 20 20"
            className="size-4 animate-spin overflow-visible"
          >
            <circle
              cx="50%"
              cy="50%"
              fill="none"
              r="10"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="2"
              strokeDasharray={24}
              strokeDashoffset={4}
            ></circle>
          </svg>
        )}
        {children}
      </div>
    </button>
  );
};

export { SubmitWithPending };
