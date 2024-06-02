import { Fieldset } from "../components/primitives/fieldset";
import { VisibilitySwitcher } from "../components/visibility-switcher";
import * as SettingsSection from "../components/settings-section";
import { validateRequest } from "@/lib/auth/lucia";
import {
  getCollectionPreferences,
  updateDefaultVisibility,
} from "@/lib/dal/collections";
import { validateVisibility } from "@/lib/dal/visibility";

const CollectionSettingsPage = async () => {
  const { session } = await validateRequest();

  const preferences = session
    ? await getCollectionPreferences(session.id)
    : undefined;

  const changeCollectionVisibilityWithSessionId =
    changeDefaultCollectionVisibility.bind(null, session?.id);

  return (
    <>
      <SettingsSection.Root>
        <SettingsSection.Label>Collection Preferences</SettingsSection.Label>
        <SettingsSection.Grid>
          <form action={changeCollectionVisibilityWithSessionId}>
            <Fieldset label="Default Visibility">
              <VisibilitySwitcher
                name="visibility"
                defaultValue={preferences?.defaultVisibility}
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
  sessionId: string | undefined,
  formData: FormData,
) {
  "use server";

  if (typeof sessionId !== "string") return;

  const visibility = formData.get("visibility");
  if (!validateVisibility(visibility)) return;

  await updateDefaultVisibility(sessionId, visibility);
}

export default CollectionSettingsPage;
