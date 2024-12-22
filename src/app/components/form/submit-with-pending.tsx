"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { BaseButton } from "../base-button";

const SubmitWithPending = ({
  children,
  disabled,
  ...props
}: ComponentProps<"button">) => {
  const { pending } = useFormStatus();
  return (
    <BaseButton
      className="group"
      disabled={disabled || pending}
      {...props}
      type="submit"
    >
      <div className="relative isolate flex items-center gap-2 bg-inherit">
        {pending && (
          <span className="absolute inset-0 z-10 grid size-full place-items-center bg-inherit">
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
                strokeLinecap="round"
                strokeWidth="2"
                strokeDasharray={24}
                strokeDashoffset={4}
              ></circle>
            </svg>
          </span>
        )}
        {children}
      </div>
    </BaseButton>
  );
};

export { SubmitWithPending };
