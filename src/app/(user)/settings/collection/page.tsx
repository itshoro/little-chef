import * as Form from "@/components/forms/form";
import { SubmitWithPending } from "@/components/forms/form/submit-with-pending";
import { VisibilitySwitcher } from "@/components/forms/visibility-switcher";
import { Fieldset } from "@/components/ui/fieldset";
import { getAuthenticatedUserOrRedirect } from "@/lib/services/auth";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import { getCollectionPreferences } from "@/lib/services/user";
import type { Metadata } from "next";
import * as SettingsSection from "../../../../components/layout/settings-section";
import { changeDefaultVisibility } from "./actions/change-default-visibility";

export const metadata: Metadata = {
  title: "Collection Preferences",
};

const CollectionSettingsPage = async () => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const { user } = await getAuthenticatedUserOrRedirect();
  const preferences = await getCollectionPreferences(user);

  return (
    <>
      <SettingsSection.Root>
        <SettingsSection.Label>Collection Preferences</SettingsSection.Label>
        <SettingsSection.Grid>
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

export default CollectionSettingsPage;
