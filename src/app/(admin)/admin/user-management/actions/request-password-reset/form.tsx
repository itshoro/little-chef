"use client";

import type { User } from "@/drizzle/schema";
import { requestPasswordResetAction } from "./action";
import { useTransition } from "react";

type RequestPasswordResetActionFormProps = {
  userId: User["id"];
};

const RequestPasswordResetActionForm = ({
  userId,
}: RequestPasswordResetActionFormProps) => {
  const [_, startTransition] = useTransition();

  // todo: handle errors and loading state.
  return (
    <button
      onClick={() => {
        startTransition(async () => {
          const resetToken = await requestPasswordResetAction(userId);
          const url = new URL("/reset-password", window.location.origin);
          url.searchParams.set("token", resetToken);

          navigator.clipboard.writeText(url.toString());
          window.alert("Link copied to clipboard.");
        });
      }}
    >
      Request Password Reset
    </button>
  );
};

export { RequestPasswordResetActionForm };
