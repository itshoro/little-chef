import { LanguageSelect } from "../components/language-select";
import { Fieldset } from "../components/primitives/fieldset";
import { ThemeSwitcher } from "../components/theme-switcher";
import * as SettingsSection from "../components/settings-section";
import { validateRequest } from "@/lib/auth/lucia";
import {
  changeLanguage,
  changeTheme,
  getAppPreferences,
  isSupportedTheme,
} from "@/lib/dal/app";

const AppSettingsPage = async () => {
  const { user } = await validateRequest();

  const preferences = user ? await getAppPreferences(user.id) : undefined;
  const changeAppLanguageWithUserId = changeAppLanguage.bind(null, user?.id);
  const changeAppThemeWithUserId = changeAppTheme.bind(null, user?.id);

  return (
    <>
      <SettingsSection.Root>
        <SettingsSection.Label>App Preferences</SettingsSection.Label>
        <SettingsSection.Grid>
          <form action={changeAppLanguageWithUserId}>
            <Fieldset label="Language">
              <LanguageSelect
                name="language"
                defaultValue={preferences?.displayLanguageCode}
              />
            </Fieldset>
          </form>
          <form action={changeAppThemeWithUserId}>
            <Fieldset label="Theme">
              <ThemeSwitcher />
            </Fieldset>
          </form>
        </SettingsSection.Grid>
      </SettingsSection.Root>
    </>
  );
};

async function changeAppLanguage(
  userId: number | undefined,
  formData: FormData,
) {
  "use server";
  if (userId === undefined) return;

  const language = formData.get("language");
  if (typeof userId !== "string" || typeof language !== "string") return;

  await changeLanguage(userId, language);
}

async function changeAppTheme(userId: number | undefined, formData: FormData) {
  "use server";
  if (userId === undefined) return;

  const theme = formData.get("theme");

  if (typeof theme !== "string" || !isSupportedTheme(theme)) {
    return;
  }

  await changeTheme(userId, theme);
}

export default AppSettingsPage;
