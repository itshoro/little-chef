"use client";

import { PendingButton } from "@/components/ui/buttons/pending-button";
import { FieldRoot } from "@/components/ui/controls/field-root";
import { Input } from "@/components/ui/controls/input";
import { Label } from "@/components/ui/controls/label";
import { useTransition } from "react";
import { SettingsCard } from "../../_components/settings-card";
import { changePasswordAction } from "../_actions/update-password";

const UpdatePasswordForm = () => {
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      await changePasswordAction(new FormData(e.target as HTMLFormElement));
      (e.target as HTMLFormElement).reset();
    });
  };

  return (
    <SettingsCard>
      <SettingsCard.Header title="Change your Password" />

      <form onSubmit={onSubmit}>
        <div className="mb-4 grid max-w-prose gap-4">
          <FieldRoot name="currentPassword">
            <Label>Current password</Label>
            <Input type="password" />
          </FieldRoot>
          <FieldRoot name="newPassword">
            <Label>New password</Label>
            <Input type="password" />
          </FieldRoot>
          <FieldRoot name="confirmPassword">
            <Label>Confirm password</Label>
            <Input type="password" />
          </FieldRoot>
        </div>

        <SettingsCard.Footer
          description=" Changing your password will log out all of your sessions,
              requiring you to authenticate on other devices again."
          actions={
            <PendingButton pending={pending} variant="secondary">
              Save
            </PendingButton>
          }
        />
      </form>
    </SettingsCard>
  );
};

export { UpdatePasswordForm };
