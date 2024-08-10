import { Fieldset } from "../components/primitives/fieldset";
import { VisibilitySwitcher } from "../components/visibility-switcher";
import * as SettingsSection from "../components/settings-section";
import * as Input from "@/app/components/input";
import { validateRequest } from "@/lib/auth/lucia";
import {
  getRecipePreferences,
  updateDefaultServingSize,
  updateDefaultVisibility,
} from "@/lib/dal/recipe";
import { revalidatePath } from "next/cache";
import { validateVisibility } from "@/lib/dal/visibility";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { authorizeFromSession } from "@/lib/dal/user";

export const metadata: Metadata = {
  title: "Recipe Preferences",
};

const RecipeSettingsPage = async () => {
  const { user, session } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  const preferences = await getRecipePreferences(user.publicId);

  const changeServingSizeWithUserId = changeDefaultRecipeServingSize.bind(
    null,
    session.id,
  );
  const changeVisibilityWithUserId = changeDefaultRecipeVisibility.bind(
    null,
    session.id,
  );

  return (
    <>
      <SettingsSection.Root>
        <SettingsSection.Label>Recipe Preferences</SettingsSection.Label>
        <SettingsSection.Grid>
          <form action={changeServingSizeWithUserId}>
            <Fieldset label="Servings">
              <Input.Root name="defaultServingSize">
                <Input.Label>Default Serving Size</Input.Label>
                <Input.Group>
                  <Input.Element
                    type="number"
                    defaultValue={preferences.defaultServingSize}
                  />
                </Input.Group>
              </Input.Root>
              <button
                className="mt-4 rounded-full bg-lime-300 px-5 py-3 font-medium dark:text-black"
                type="submit"
              >
                Update Servings
              </button>
            </Fieldset>
          </form>
          <form action={changeVisibilityWithUserId}>
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

async function changeDefaultRecipeVisibility(
  sessionId: string | undefined,
  formData: FormData,
) {
  "use server";
  const user = await authorizeFromSession(sessionId);
  const visibility = formData.get("visibility");

  if (!validateVisibility(visibility)) return;
  await updateDefaultVisibility(user, visibility);

  revalidatePath("/settings/recipe");
}

async function changeDefaultRecipeServingSize(
  sessionId: string | undefined,
  formData: FormData,
) {
  "use server";
  const user = await authorizeFromSession(sessionId);
  const defaultServingSize = Number(formData.get("defaultServingSize"));

  if (isNaN(defaultServingSize)) return;
  await updateDefaultServingSize(user, defaultServingSize);

  revalidatePath("/settings/recipe");
}

export default RecipeSettingsPage;
