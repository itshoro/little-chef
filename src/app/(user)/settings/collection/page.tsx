import { Fieldset } from "../components/primitives/fieldset";
import { LanguageSelect } from "../components/language-select";
import { VisibilitySwitcher } from "../components/visibility-switcher";
import * as SettingsSection from "../components/settings-section";
import { validateRequest } from "@/lib/auth/lucia";
import { updateDefaultVisibility, validateVisibility } from "@/lib/dal/recipe";
import {
  getCollectionPreferences,
  updateDefaultLanguage,
} from "@/lib/dal/collections";

const CollectionSettingsPage = async () => {
  const { user } = await validateRequest();

  const preferences = await getCollectionPreferences(user?.id);
  const defaultVisibility = validateVisibility(preferences?.defaultVisibility)
    ? preferences.defaultVisibility
    : undefined;

  const changeCollectionLanguageWithUserId =
    changeDefaultCollectionLanguage.bind(null, user?.id);
  const changeCollectionVisibilityWithUserId =
    changeDefaultCollectionVisibility.bind(null, user?.id);

  return (
    <>
      <SettingsSection.Root>
        <SettingsSection.Label>Collection Preferences</SettingsSection.Label>
        <SettingsSection.Grid>
          <form action={changeCollectionLanguageWithUserId}>
            <Fieldset label="Default Language">
              <LanguageSelect
                name="language"
                defaultValue={preferences?.defaultLanguageCode}
              />
            </Fieldset>
          </form>

          <form action={changeCollectionVisibilityWithUserId}>
            <Fieldset label="Default Visibility">
              <VisibilitySwitcher
                name="visibility"
                defaultValue={defaultVisibility}
              />
            </Fieldset>
          </form>
        </SettingsSection.Grid>
      </SettingsSection.Root>
    </>
  );
};

async function changeDefaultCollectionVisibility(
  userId: string | undefined,
  formData: FormData,
) {
  "use server";

  if (typeof userId !== "string") return;

  const visibility = formData.get("visibility");
  if (!validateVisibility(visibility)) return;

  await updateDefaultVisibility(userId, visibility);
}

async function changeDefaultCollectionLanguage(
  userId: string | undefined,
  formData: FormData,
) {
  "use server";

  if (typeof userId !== "string") return;

  const languageCode = formData.get("language");
  if (typeof languageCode !== "string") return;

  await updateDefaultLanguage(userId, languageCode);
}

export default CollectionSettingsPage;
