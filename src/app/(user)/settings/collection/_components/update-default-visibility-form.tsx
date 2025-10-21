"use client";

import { PendingButton } from "@/components/ui/buttons/pending-button";
import { FieldRoot } from "@/components/ui/controls/field-root";
import { Label } from "@/components/ui/controls/label";
import { VisibilitySwitcher } from "@/components/ui/controls/visibility-switcher";
import type { DrizzleCollectionPreferences } from "@/drizzle/schema";
import { useTransition } from "react";
import { SettingsCard } from "../../_components/settings-card";
import { changeDefaultVisibilityAction } from "../_actions/update-default-visibility";

const UpdateDefaultVisibilityForm = ({
  preferences,
}: {
  preferences: DrizzleCollectionPreferences;
}) => {
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      await changeDefaultVisibilityAction(
        new FormData(e.target as HTMLFormElement),
      );
    });
  };

  return (
    <SettingsCard>
      <form onSubmit={onSubmit}>
        <SettingsCard.Header title="Change default visibility" />

        <FieldRoot name="visibility">
          <Label>Visibility</Label>
          <VisibilitySwitcher defaultValue={preferences.defaultVisibility} />
        </FieldRoot>

        <SettingsCard.Footer
          description="Select a default visibility preference for new collections."
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

export { UpdateDefaultVisibilityForm };
