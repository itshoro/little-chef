import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import {
  redirectToSignIn,
  requireSession,
} from "@/lib/utils/auth/require-session";
import { getRecipePreferences } from "@/lib/utils/user/get-preferences";
import type { Metadata } from "next";
import { RecipeForm } from "../_components/recipe-form";
import { createAction } from "./action";

export const metadata: Metadata = {
  title: "Add Recipe",
};

const AddRecipePage = async () => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";

  const { user } = await requireSession({
    onUnauthenticated: () => redirectToSignIn("/recipes/add"),
  });
  const preferences = await getRecipePreferences(user);

  return (
    <>
      <RecipeForm
        action={createAction}
        buttonLabel="Create Recipe"
        defaultValue={{
          recommendedServingSize: preferences.defaultServingSize,
          visibility: preferences.defaultVisibility,
        }}
      />
    </>
  );
};

export default AddRecipePage;
