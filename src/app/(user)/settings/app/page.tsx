import { LanguageSelect } from "../components/language-select";
import { Fieldset } from "../components/primitives/fieldset";
import { ThemeSwitcher } from "../components/theme-switcher";
import * as SettingsSection from "../components/settings-section";
import { validateRequest } from "@/lib/auth/lucia";
import { getPrismaClient } from "@/lib/prisma";
import {
  changeLanguage,
  changeTheme,
  isSupportedTheme,
} from "@/lib/dal/settings/app";

const AppSettingsPage = async () => {
  const { user, session } = await validateRequest();

  const client = getPrismaClient();
  const language = await client.language.findFirst({
    where: { code: user?.languageCode },
  });

  return (
    <>
      <SettingsSection.Root>
        <SettingsSection.Label>App Preferences</SettingsSection.Label>
        <SettingsSection.Grid>
          <form action={changeAppLanguage}>
            <input type="hidden" name="sessionId" value={session?.id} />
            <Fieldset label="Language">
              <LanguageSelect name="language" defaultValue={language?.code} />
            </Fieldset>
          </form>
          <form action={changeAppTheme}>
            <input type="hidden" name="sessionId" value={session?.id} />
            <Fieldset label="Theme">
              <ThemeSwitcher />
            </Fieldset>
          </form>
        </SettingsSection.Grid>
      </SettingsSection.Root>
    </>
  );
};

async function changeAppLanguage(formData: FormData) {
  "use server";
  const sessionId = formData.get("sessionId");
  const language = formData.get("language");
  if (typeof sessionId !== "string" || typeof language !== "string") return;

  await changeLanguage(sessionId, language);
}

async function changeAppTheme(formData: FormData) {
  "use server";
  const sessionId = formData.get("sessionId");
  const theme = formData.get("theme");

  if (
    typeof sessionId !== "string" ||
    typeof theme !== "string" ||
    !isSupportedTheme(theme)
  ) {
    return;
  }

  await changeTheme(sessionId, theme);
}

export default AppSettingsPage;
