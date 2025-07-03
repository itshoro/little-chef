import * as Form from "@/components/forms/form";
import { SubmitWithPending } from "@/components/forms/form/submit-with-pending";
import * as Input from "@/components/forms/input";
import { VisibilitySwitcher } from "@/components/forms/visibility-switcher";
import { Fieldset } from "@/components/ui/fieldset";
import { getAuthenticatedUserOrRedirect } from "@/lib/services/auth";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import { getRecipePreferences } from "@/lib/services/user";
import type { Metadata } from "next";
import * as SettingsSection from "../../../../components/layout/settings-section";
import { changeDefaultServingSizeAction } from "./actions/default-serving-size";
import { changeDefaultVisibility } from "./actions/default-visibility";

export const metadata: Metadata = {
  title: "Recipe Preferences",
};

const RecipeSettingsPage = async () => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const { user } = await getAuthenticatedUserOrRedirect();
  const preferences = await getRecipePreferences(user);

  return (
    <>
      <SettingsSection.Root>
        <SettingsSection.Label>Recipe Preferences</SettingsSection.Label>
        <SettingsSection.Grid>
          <Form.Root action={changeDefaultServingSizeAction}>
            <Fieldset label="Servings">
              <div className="mb-4">
                <Input.Root name="defaultServingSize">
                  <Input.Label className="pb-2">
                    Default Serving Size
                  </Input.Label>
                  <Input.Group>
                    <Input.Element
                      type="number"
                      defaultValue={preferences.defaultServingSize}
                    />
                  </Input.Group>
                  <Input.InlineError />
                </Input.Root>
              </div>
              <Form.Alert />
              <SubmitWithPending className="mt-2" type="submit">
                Change default serving size
              </SubmitWithPending>
            </Fieldset>
          </Form.Root>
          <Form.Root action={changeDefaultVisibility}>
            <Fieldset label="Default Visibility">
              <div className="mb-4">
                <VisibilitySwitcher
                  name="visibility"
                  defaultValue={preferences.defaultVisibility}
                />
              </div>
              <Form.Alert />
              <SubmitWithPending className="mt-2" type="submit">
                Change default visibility
              </SubmitWithPending>
            </Fieldset>
          </Form.Root>
        </SettingsSection.Grid>
      </SettingsSection.Root>
    </>
  );
};

export default RecipeSettingsPage;
