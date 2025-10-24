"use client";

import { Label } from "@/components/layout/settings-section";
import { PendingButton } from "@/components/ui/buttons/pending-button";
import { FieldRoot } from "@/components/ui/controls/field-root";
import { Input } from "@/components/ui/controls/input";
import { passwordRange } from "@/domain/user/credentials";
import { useTransition } from "react";

const ResetPasswordForm = ({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) => {
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const formData = new FormData(e.currentTarget);
      await action(formData);
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-4">
        <FieldRoot name="password">
          <Label>New Password</Label>
          <Input
            type="password"
            required
            minLength={passwordRange.min}
            maxLength={passwordRange.max}
            autoComplete="new-password"
          />
        </FieldRoot>
      </div>
      <div className="mb-4">
        <FieldRoot name="confirmation-password">
          <Label>Confirm Password</Label>
          <Input
            type="password"
            required
            minLength={passwordRange.min}
            maxLength={passwordRange.max}
            autoComplete="new-password"
          />
        </FieldRoot>
      </div>

      <div className="mt-2 flex items-baseline justify-between">
        <PendingButton pending={pending}>Change Password</PendingButton>
      </div>
    </form>
  );
};

export { ResetPasswordForm };
