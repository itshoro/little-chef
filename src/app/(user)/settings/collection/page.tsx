import * as Form from "@/components/forms/form";
import { SubmitWithPending } from "@/components/forms/form/submit-with-pending";
import { validateRequest } from "@/lib/auth";
import { getCollectionPreferences } from "@/lib/dal/collection";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Fieldset } from "../../../../components/forms/fieldset";
import * as SettingsSection from "../../../../components/layout/settings-section";
import { VisibilitySwitcher } from "../components/visibility-switcher";
import { changeDefaultVisibility } from "./actions/change-default-visibility";

export const metadata: Metadata = {
  title: "Collection Preferences",
};

const CollectionSettingsPage = async () => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const { user, session } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  const preferences = await getCollectionPreferences(user.publicId);

  const changeVisibilityWithSession = changeDefaultVisibility.bind(
    null,
    session.id,
  );

  return (
    <>
      <SettingsSection.Root>
        <SettingsSection.Label>Collection Preferences</SettingsSection.Label>
        <SettingsSection.Grid>
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

export default CollectionSettingsPage;
