import { Fieldset } from "../components/primitives/fieldset";
import { LanguageSelect } from "../components/language-select";
import { VisibilitySwitcher } from "../components/visibility-switcher";
import * as SettingsSection from "../components/settings-section";
import { validateRequest } from "@/lib/auth/lucia";
import {
  getCollectionPreferences,
  updateDefaultLanguage,
  updateDefaultVisibility,
} from "@/lib/dal/collections";
import { validateVisibility } from "@/lib/dal/visibility";

const CollectionSettingsPage = async () => {
  const { session } = await validateRequest();

  const preferences = session
    ? await getCollectionPreferences(session.id)
    : undefined;

  const changeCollectionLanguageWithSessionId =
    changeDefaultCollectionLanguage.bind(null, session?.id);
  const changeCollectionVisibilityWithSessionId =
    changeDefaultCollectionVisibility.bind(null, session?.id);

  return (
    <>
      <SettingsSection.Root>
        <SettingsSection.Label>Collection Preferences</SettingsSection.Label>
        <SettingsSection.Grid>
          <form action={changeCollectionLanguageWithSessionId}>
            <Fieldset label="Default Language">
              <LanguageSelect
                name="language"
                defaultValue={preferences?.defaultLanguageCode}
              />
            </Fieldset>
          </form>

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

async function changeDefaultCollectionLanguage(
  sessionId: string | undefined,
  formData: FormData,
) {
  "use server";

  if (typeof sessionId !== "string") return;

  const languageCode = formData.get("language");
  if (typeof languageCode !== "string") return;

  await updateDefaultLanguage(sessionId, languageCode);
}

export default CollectionSettingsPage;
