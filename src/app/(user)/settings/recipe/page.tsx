import * as Form from "@/app/components/form";
import { SubmitWithPending } from "@/app/components/form/submit-with-pending";
import * as Input from "@/app/components/input";
import { validateRequest } from "@/lib/auth";
import { getRecipePreferences } from "@/lib/dal/auth";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Fieldset } from "../components/primitives/fieldset";
import * as SettingsSection from "../components/settings-section";
import { VisibilitySwitcher } from "../components/visibility-switcher";
import { changeDefaultServingSizeAction } from "./actions/default-serving-size";
import { changeDefaultVisibility } from "./actions/default-visibility";

export const metadata: Metadata = {
  title: "Recipe Preferences",
};

const RecipeSettingsPage = async () => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const { user, session } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  const preferences = await getRecipePreferences(user.publicId);
  const changeServingSizeWithSession = changeDefaultServingSizeAction.bind(
    null,
    session.id,
  );
  const changeVisibilityWithSession = changeDefaultVisibility.bind(
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
          <Form.Root action={changeVisibilityWithSession}>
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
