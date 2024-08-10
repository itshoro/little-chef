import { Fieldset } from "../components/primitives/fieldset";
import { VisibilitySwitcher } from "../components/visibility-switcher";
import * as SettingsSection from "../components/settings-section";
import { validateRequest } from "@/lib/auth/lucia";
import {
  getCollectionPreferences,
  updateDefaultVisibility,
} from "@/lib/dal/collections";
import { validateVisibility } from "@/lib/dal/visibility";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { authorizeFromSession } from "@/lib/dal/user";

export const metadata: Metadata = {
  title: "Collection Preferences",
};

const CollectionSettingsPage = async () => {
  const { user, session } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  const preferences = await getCollectionPreferences(user.publicId);

  const changeCollectionVisibilityWithUser =
    changeDefaultCollectionVisibility.bind(null, session.id);

  return (
    <>
      <SettingsSection.Root>
        <SettingsSection.Label>Collection Preferences</SettingsSection.Label>
        <SettingsSection.Grid>
          <form action={changeCollectionVisibilityWithUser}>
            <Fieldset label="Default Visibility">
              <VisibilitySwitcher
                name="visibility"
                defaultValue={preferences.defaultVisibility}
                triggerSubmitOnChange
              />
            </Fieldset>
          </form>
        </SettingsSection.Grid>
      </SettingsSection.Root>
    </>
  );
};

async function changeDefaultCollectionVisibility(
  sessionId: string,
  formData: FormData,
) {
  "use server";
  const user = await authorizeFromSession(sessionId);

  const visibility = formData.get("visibility");
  if (!validateVisibility(visibility)) return;

  await updateDefaultVisibility(user, visibility);
}

export default CollectionSettingsPage;
