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

export const metadata: Metadata = {
  title: "Collection Preferences",
};

const CollectionSettingsPage = async () => {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  const preferences = await getCollectionPreferences(user.publicId);

  const changeCollectionVisibilityWithUser =
    changeDefaultCollectionVisibility.bind(null, user.publicId);

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
  publicUserId: string | undefined,
  formData: FormData,
) {
  "use server";

  if (typeof publicUserId !== "string") return;

  const visibility = formData.get("visibility");
  if (!validateVisibility(visibility)) return;

  await updateDefaultVisibility(publicUserId, visibility);
}

export default CollectionSettingsPage;
