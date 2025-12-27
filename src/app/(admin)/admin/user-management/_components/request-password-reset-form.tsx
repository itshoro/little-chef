"use client";

import { PendingButton } from "@/components/ui/buttons/pending-button";
import type { User } from "@/lib/domain/user/user";
import { useTransition } from "react";
import { requestPasswordResetAction } from "../_actions/request-password-reset-action";

type RequestPasswordResetActionFormProps = {
  userId: User["id"];
};

const RequestPasswordResetActionForm = ({
  userId,
}: RequestPasswordResetActionFormProps) => {
  const [pending, startTransition] = useTransition();

  return (
    <PendingButton
      pending={pending}
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
    </PendingButton>
  );
};

export { RequestPasswordResetActionForm };
