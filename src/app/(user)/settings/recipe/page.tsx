import { Fieldset } from "../components/primitives/fieldset";
import { LanguageSelect } from "../components/language-select";
import { VisibilitySwitcher } from "../components/visibility-switcher";
import * as SettingsSection from "../components/settings-section";
import { validateRequest } from "@/lib/auth/lucia";
import {
  getRecipePreferences,
  updateDefaultLanguage,
  updateDefaultServingSize,
  updateDefaultVisibility,
} from "@/lib/dal/recipe";
import { revalidatePath } from "next/cache";
import { validateVisibility } from "@/lib/dal/visibility";

const RecipeSettingsPage = async () => {
  const { session } = await validateRequest();

  const preferences = session
    ? await getRecipePreferences(session.id)
    : undefined;
  const defaultVisibility = validateVisibility(preferences?.defaultVisibility)
    ? preferences.defaultVisibility
    : undefined;

  const changeLanguageWithUserId = changeDefaultRecipeLanguage.bind(
    null,
    session?.id,
  );
  const changeServingSizeWithUserId = changeDefaultRecipeServingSize.bind(
    null,
    session?.id,
  );
  const changeVisibilityWithUserId = changeDefaultRecipeVisibility.bind(
    null,
    session?.id,
  );

  return (
    <>
      <SettingsSection.Root>
        <SettingsSection.Label>Recipe Preferences</SettingsSection.Label>
        <SettingsSection.Grid>
          <form action={changeLanguageWithUserId}>
            <Fieldset label="Default Language">
              <LanguageSelect
                name="language"
                defaultValue={preferences?.defaultLanguageCode}
              />
            </Fieldset>
          </form>
          <form action={changeServingSizeWithUserId}>
            <Fieldset label="Default Serving Size">
              <input
                type="number"
                className="w-full rounded-lg"
                defaultValue={preferences?.defaultServingSize}
                name="defaultServingSize"
              />
            </Fieldset>
          </form>
          <form action={changeVisibilityWithUserId}>
            <Fieldset label="Default Visibility">
              <VisibilitySwitcher
                name="visibility"
                defaultValue={defaultVisibility}
                triggerSubmitOnChange
              />
            </Fieldset>
          </form>
        </SettingsSection.Grid>
      </SettingsSection.Root>
    </>
  );
};

async function changeDefaultRecipeLanguage(
  sessionId: string | undefined,
  formData: FormData,
) {
  "use server";
  if (typeof sessionId !== "string") return;

  const languageCode = formData.get("language");
  if (typeof languageCode !== "string") return;
  await updateDefaultLanguage(sessionId, languageCode);

  revalidatePath("/settings/recipe");
}

async function changeDefaultRecipeVisibility(
  sessionId: string | undefined,
  formData: FormData,
) {
  "use server";
  if (typeof sessionId !== "string") return;
  const visibility = formData.get("visibility");

  if (!validateVisibility(visibility)) return;
  await updateDefaultVisibility(sessionId, visibility);

  revalidatePath("/settings/recipe");
}

async function changeDefaultRecipeServingSize(
  sessionId: string | undefined,
  formData: FormData,
) {
  "use server";
  if (typeof sessionId !== "string") return;
  const defaultServingSize = Number(formData.get("defaultServingSize"));

  if (isNaN(defaultServingSize)) return;
  await updateDefaultServingSize(sessionId, defaultServingSize);

  revalidatePath("/settings/recipe");
}

export default RecipeSettingsPage;
