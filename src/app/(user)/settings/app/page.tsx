import { Fieldset } from "../components/primitives/fieldset";
import { ThemeSwitcher } from "../components/theme-switcher";
import * as SettingsSection from "../components/settings-section";
import { validateRequest } from "@/lib/auth/lucia";
import { changeTheme, isSupportedTheme } from "@/lib/dal/app";

const AppSettingsPage = async () => {
  const { user } = await validateRequest();

  const changeAppThemeWithUserId = changeAppTheme.bind(null, user?.id);

  return (
    <>
      <SettingsSection.Root>
        <SettingsSection.Label>App Preferences</SettingsSection.Label>
        <SettingsSection.Grid>
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
