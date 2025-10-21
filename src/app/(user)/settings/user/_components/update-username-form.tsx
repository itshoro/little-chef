"use client";

import { PendingButton } from "@/components/ui/buttons/pending-button";
import { FieldRoot } from "@/components/ui/controls/field-root";
import { Input } from "@/components/ui/controls/input";
import { Label } from "@/components/ui/controls/label";
import { useTransition } from "react";
import { SettingsCard } from "../../_components/settings-card";
import { updateUsernameAction } from "../_actions/update-username";

const UpdateUsername = ({
  defaultValue: username,
}: {
  defaultValue: string;
}) => {
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      await updateUsernameAction(new FormData(e.currentTarget));
      e.currentTarget.reset();
    });
  };

  return (
    <SettingsCard>
      <form onSubmit={onSubmit}>
        <FieldRoot name="username">
          <Label>Username</Label>
          <Input className="max-w-sm" defaultValue={username} />
        </FieldRoot>
        <SettingsCard.Footer
          description="Your username will be displayed across different places in Little
              Chef. Your recipe and collections will be attributed to it."
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

export { UpdateUsername };
