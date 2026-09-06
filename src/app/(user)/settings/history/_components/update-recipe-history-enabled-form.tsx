"use client";

import { PendingButton } from "@/components/ui/buttons/pending-button";
import { FieldRoot } from "@/components/ui/controls/field-root";
import { Input } from "@/components/ui/controls/input";
import { Label } from "@/components/ui/controls/label";
import type { HistoryPreferences } from "@/lib/domain/user/history-preferences";
import { useTransition } from "react";
import { SettingsCard } from "../../_components/settings-card";
import { changeRecipeHistoryEnabled } from "../_actions/update-recipe-history-enabled";

const UpdateRecipeHistoryEnabledForm = ({
  preferences,
}: {
  preferences: HistoryPreferences;
}) => {
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      await changeRecipeHistoryEnabled(
        new FormData(e.target as HTMLFormElement),
      );
    });
  };

  return (
    <SettingsCard>
      <form onSubmit={onSubmit}>
        <FieldRoot
          className="flex items-baseline gap-4"
          name="recipeHistoryEnabled"
        >
          <Input
            className="w-min"
            value="enabled"
            type="checkbox"
            defaultChecked={preferences.recipeTrackingEnabled}
          />
          <Label className="whitespace-nowrap">Recipe History Enabled</Label>
        </FieldRoot>

        <SettingsCard.Footer
          description="If disabled you will no longer find the recipes you clicked on in your recipe history. Old items are retained."
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

export { UpdateRecipeHistoryEnabledForm };
