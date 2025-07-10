import { getAuthenticatedUserOrRedirect } from "@/lib/services/auth";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import { getRecipePreferences } from "@/lib/services/user";
import type { Metadata } from "next";
import { UpdateDefaultServingSizeForm } from "./_components/update-default-serving-size-form";
import { UpdateDefaultVisibilityForm } from "./_components/update-default-visibility-form";

export const metadata: Metadata = {
  title: "Recipe Preferences",
};

const RecipeSettingsPage = async () => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const { user } = await getAuthenticatedUserOrRedirect();
  const preferences = await getRecipePreferences(user);

  return (
    <>
      <UpdateDefaultVisibilityForm preferences={preferences} />
      <UpdateDefaultServingSizeForm preferences={preferences} />
    </>
  );
};

export default RecipeSettingsPage;
