import { Fieldset } from "../components/primitives/fieldset";
import { VisibilitySwitcher } from "../components/visibility-switcher";
import * as SettingsSection from "../components/settings-section";
import { validateRequest } from "@/lib/auth/lucia";
import {
  getRecipePreferences,
  updateDefaultServingSize,
  updateDefaultVisibility,
} from "@/lib/dal/recipe";
import { revalidatePath } from "next/cache";
import { validateVisibility } from "@/lib/dal/visibility";

const RecipeSettingsPage = async () => {
  const { user } = await validateRequest();

  const preferences = user
    ? await getRecipePreferences(user.publicId)
    : undefined;
  const defaultVisibility = validateVisibility(preferences?.defaultVisibility)
    ? preferences.defaultVisibility
    : undefined;

  const changeServingSizeWithUserId = changeDefaultRecipeServingSize.bind(
    null,
    user?.publicId,
  );
  const changeVisibilityWithUserId = changeDefaultRecipeVisibility.bind(
    null,
    user?.publicId,
  );

  return (
    <>
      <SettingsSection.Root>
        <SettingsSection.Label>Recipe Preferences</SettingsSection.Label>
        <SettingsSection.Grid>
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

async function changeDefaultRecipeVisibility(
  publicUserId: string | undefined,
  formData: FormData,
) {
  "use server";
  if (typeof publicUserId !== "string") return;
  const visibility = formData.get("visibility");

  if (!validateVisibility(visibility)) return;
  await updateDefaultVisibility(publicUserId, visibility);

  revalidatePath("/settings/recipe");
}

async function changeDefaultRecipeServingSize(
  publicUserId: string | undefined,
  formData: FormData,
) {
  "use server";
  if (typeof publicUserId !== "string") return;
  const defaultServingSize = Number(formData.get("defaultServingSize"));

  if (isNaN(defaultServingSize)) return;
  await updateDefaultServingSize(publicUserId, defaultServingSize);

  revalidatePath("/settings/recipe");
}

export default RecipeSettingsPage;
