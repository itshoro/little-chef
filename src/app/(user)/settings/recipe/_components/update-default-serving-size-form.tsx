"use client";

import { PendingButton } from "@/components/ui/buttons/pending-button";
import { FieldRoot } from "@/components/ui/controls/field-root";
import { Input } from "@/components/ui/controls/input";
import { Label } from "@/components/ui/controls/label";
import type { RecipePreferences } from "@/lib/domain/user/recipe-preferences";
import { useTransition } from "react";
import { SettingsCard } from "../../_components/settings-card";
import { changeDefaultServingSizeAction } from "../_actions/default-serving-size";

const UpdateDefaultServingSizeForm = ({
  preferences,
}: {
  preferences: RecipePreferences;
}) => {
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      await changeDefaultServingSizeAction(new FormData(e.currentTarget));
    });
  }

  return (
    <SettingsCard>
      <form onSubmit={onSubmit}>
        <SettingsCard.Header title="Change default visibility" />
        <FieldRoot name="servingSize">
          <Label>Default Serving Size</Label>
          <Input
            defaultValue={preferences.defaultServingSize}
            min={0}
            type="number"
          />
        </FieldRoot>
        <SettingsCard.Footer
          description="Select a default recommended serving size for new recipes."
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

export { UpdateDefaultServingSizeForm };
