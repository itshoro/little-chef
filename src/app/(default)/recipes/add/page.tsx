import { getAuthenticatedUserFromRequest } from "@/lib/services/auth";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import { getRecipePreferences } from "@/lib/services/user";
import type { Metadata } from "next";
import { RecipeForm } from "../_components/recipe-form";
import { createAction } from "./action";

export const metadata: Metadata = {
  title: "Add Recipe",
};

const AddRecipePage = async () => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";

  const { user, session } = await getAuthenticatedUserFromRequest();
  const isDemoMode = user === null;

  const preferences = !isDemoMode
    ? await getRecipePreferences(user)
    : undefined;

  return (
    <>
      {isDemoMode && (
        <div className="mb-6 rounded-lg bg-lime-300 px-6 py-4 text-black">
          <div className="mb-2 font-medium">Demo Mode</div>
          <div className="text-sm">You will be unable to create a form.</div>
        </div>
      )}
      <RecipeForm
        action={createAction}
        buttonLabel="Create Recipe"
        defaultValue={{
          recipe: {
            recommendedServingSize: preferences?.defaultServingSize,
            visibility: preferences?.defaultVisibility,
          },
        }}
      />
    </>
  );
};

export default AddRecipePage;
