import * as Form from "@/app/components/form";
import { SubmitWithPending } from "@/app/components/form/submit-with-pending";
import { validateRequest } from "@/lib/auth/lucia";
import { getCollectionPreferences } from "@/lib/dal/collections";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Fieldset } from "../components/primitives/fieldset";
import * as SettingsSection from "../components/settings-section";
import { VisibilitySwitcher } from "../components/visibility-switcher";
import { changeDefaultVisibility } from "./actions/change-default-visibility";

export const metadata: Metadata = {
  title: "Collection Preferences",
};

const CollectionSettingsPage = async () => {
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
                  triggerSubmitOnChange
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
