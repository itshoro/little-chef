import { BaseButton } from "@/app/components/base-button";
import * as Form from "@/app/components/form";
import * as Input from "@/app/components/input";
import { validateRequest } from "@/lib/auth/lucia";
import { getRecipePreferences } from "@/lib/dal/recipe";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Fieldset } from "../components/primitives/fieldset";
import * as SettingsSection from "../components/settings-section";
import { VisibilitySwitcher } from "../components/visibility-switcher";

export const metadata: Metadata = {
  title: "Recipe Preferences",
};

const RecipeSettingsPage = async () => {
  const { user, session } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  const preferences = await getRecipePreferences(user.publicId);

  const changeServingSizeWithSession = changeDefaultServingSizeAction.bind(
    null,
    session.id,
  );
  const changeVisibilityWithSession = changeDefaultRecipeVisibility.bind(
    null,
    session.id,
  );

  return (
    <>
      <SettingsSection.Root>
        <SettingsSection.Label>Recipe Preferences</SettingsSection.Label>
        <SettingsSection.Grid>
          <Form.Root action={changeServingSizeWithSession}>
            <Fieldset label="Servings">
              <Input.Root name="defaultServingSize">
                <Input.Label>Default Serving Size</Input.Label>
                <Input.Group>
                  <Input.Element
                    type="number"
                    defaultValue={preferences.defaultServingSize}
                  />
                </Input.Group>
              </Input.Root>
              <BaseButton className="mt-6" type="submit">
                Update Servings
              </BaseButton>
            </Fieldset>
          </Form.Root>
          <Form.Root action={changeVisibilityWithSession}>
            <Fieldset label="Default Visibility">
              <VisibilitySwitcher
                name="visibility"
                defaultValue={preferences.defaultVisibility}
                triggerSubmitOnChange
              />
            </Fieldset>
          </Form.Root>
        </SettingsSection.Grid>
      </SettingsSection.Root>
    </>
  );
};

export default RecipeSettingsPage;
