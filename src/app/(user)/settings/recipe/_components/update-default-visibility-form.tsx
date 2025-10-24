"use client";

import { Label } from "@/components/layout/settings-section";
import { PendingButton } from "@/components/ui/buttons/pending-button";
import { FieldRoot } from "@/components/ui/controls/field-root";
import { VisibilitySwitcher } from "@/components/ui/controls/visibility-switcher";
import type { RecipePreferences } from "@/lib/domain/user/recipe-preferences";
import { useTransition } from "react";
import { SettingsCard } from "../../_components/settings-card";
import { changeDefaultVisibility } from "../_actions/default-visibility";

const UpdateDefaultVisibilityForm = ({
  preferences,
}: {
  preferences: RecipePreferences;
}) => {
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      await changeDefaultVisibility(new FormData(e.currentTarget));
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <SettingsCard>
        <SettingsCard.Header title="Change default visibility" />

        <FieldRoot name="visibility">
          <Label>Visibility</Label>
          <VisibilitySwitcher defaultValue={preferences.defaultVisibility} />
        </FieldRoot>
        <SettingsCard.Footer
          description="Select a default visibility preference for new recipes."
          actions={
            <PendingButton pending={pending} variant="secondary">
              Save
            </PendingButton>
          }
        />
      </SettingsCard>
    </form>
  );
};

export { UpdateDefaultVisibilityForm };
