import {
  redirectToSignIn,
  requireSession,
} from "@/lib/utils/auth/require-session";
import { isRateLimitedGlobally } from "@/lib/utils/rate-limit/global";
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
  const preferencesRes = await getRecipePreferences(user);
  if (!preferencesRes.ok) throw preferencesRes.error;

  return (
    <div className="px-4">
      <RecipeForm
        action={createAction}
        buttonLabel="Create Recipe"
        defaultValue={{
          recommendedServingSize: preferencesRes.value.defaultServingSize,
          visibility: preferencesRes.value.defaultVisibility,
        }}
      />
    </div>
  );
};

export default AddRecipePage;
