import { isRateLimitedGlobally } from "@/lib/utils/rate-limit/global";
import {
  redirectToSignIn,
  requireSession,
} from "@/lib/utils/auth/require-session";
import { getRecipePreferences } from "@/lib/utils/user/get-preferences";
import type { Metadata } from "next";
import { UpdateDefaultServingSizeForm } from "./_components/update-default-serving-size-form";
import { UpdateDefaultVisibilityForm } from "./_components/update-default-visibility-form";

export const metadata: Metadata = {
  title: "Recipe Preferences",
};

const RecipeSettingsPage = async () => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const { user } = await requireSession({
    onUnauthenticated: () => redirectToSignIn("/settings/recipe"),
  });
  const preferences = await getRecipePreferences(user);

  return (
    <>
      <UpdateDefaultVisibilityForm preferences={preferences} />
      <UpdateDefaultServingSizeForm preferences={preferences} />
    </>
  );
};

export default RecipeSettingsPage;
