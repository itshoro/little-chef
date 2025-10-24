"use client";

import { PendingButton } from "@/components/ui/buttons/pending-button";
import { FieldRoot } from "@/components/ui/controls/field-root";
import { Input } from "@/components/ui/controls/input";
import { Label } from "@/components/ui/controls/label";
import { passwordRange, usernameRange } from "@/domain/user/credentials";
import { useTransition } from "react";

const VerifyForm = ({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) => {
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      await action(new FormData(e.currentTarget));
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-4">
        <FieldRoot name="username">
          <Label>Username</Label>
          <Input
            type="text"
            minLength={usernameRange.min}
            maxLength={usernameRange.max}
            autoComplete="username"
          />
        </FieldRoot>
      </div>
      <div className="mb-4">
        <FieldRoot name="password">
          <Label>Password</Label>
          <Input
            type="password"
            minLength={passwordRange.min}
            maxLength={passwordRange.max}
            autoComplete="current-password"
          />
        </FieldRoot>
      </div>

      <div className="mt-2 flex items-baseline justify-between">
        <PendingButton pending={pending}>Verify Credentials</PendingButton>
      </div>
    </form>
  );
};

export { VerifyForm };
