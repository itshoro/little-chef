import { Fieldset } from "../components/primitives/fieldset";
import { LanguageSelect } from "../components/language-select";
import { VisibilitySwitcher } from "../components/visibility-switcher";
import * as SettingsSection from "../components/settings-section";
import { validateRequest } from "@/lib/auth/lucia";
import {
  getRecipePreferences,
  updateDefaultLanguage,
  updateDefaultVisibility,
  validateVisibility,
} from "@/lib/dal/recipe";
import { revalidatePath } from "next/cache";

const RecipeSettingsPage = async () => {
  const { user } = await validateRequest();

  const preferences = await getRecipePreferences(user?.id);
  const defaultVisibility = validateVisibility(preferences?.defaultVisibility)
    ? preferences.defaultVisibility
    : undefined;

  const changeLanguageWithUserId = changeDefaultRecipeLanguage.bind(
    null,
    user?.id,
  );
  const changeServingSizeWithUserId = changeDefaultRecipeServingSize.bind(
    null,
    user?.id,
  );
  const changeVisibilityWithUserId = changeDefaultRecipeVisibility.bind(
    null,
    user?.id,
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
              />
            </Fieldset>
          </form>
          <form action={changeVisibilityWithUserId}>
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

async function changeDefaultRecipeLanguage(
  userId: string | undefined,
  formData: FormData,
) {
  "use server";
  if (typeof userId !== "string") return;

  const languageCode = formData.get("language");
  if (typeof languageCode !== "string") return;

  await updateDefaultLanguage(userId, languageCode);

  revalidatePath("/settings/recipe");
}

async function changeDefaultRecipeVisibility(
  userId: string | undefined,
  formData: FormData,
) {
  "use server";
  if (typeof userId !== "string") return;
  const visibility = formData.get("visibility");

  if (!validateVisibility(visibility)) return;
  await updateDefaultVisibility(userId, visibility);

  revalidatePath("/settings/recipe");
}

async function changeDefaultRecipeServingSize(
  userId: string | undefined,
  formData: FormData,
) {
  "use server";
  if (typeof userId !== "string") return;
  const visibility = formData.get("visibility");

  if (!validateVisibility(visibility)) return;

  revalidatePath("/settings/recipe");
}

export default RecipeSettingsPage;
