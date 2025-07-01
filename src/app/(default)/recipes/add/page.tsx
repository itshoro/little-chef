import * as Form from "@/components/forms/form";
import { SubmitWithPending } from "@/components/forms/form/submit-with-pending";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import type { Metadata } from "next";
import { DefaultValuesWrapper } from "../../../../components/recipes/recipe-form/default-values-wrapper";
import { createAction } from "./action";
import { getAuthenticatedUserFromRequest } from "@/lib/services/auth";
import { getRecipePreferences } from "@/lib/services/user";

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
      <Form.Root action={createAction}>
        <input type="hidden" name="sessionId" value={session?.id} />
        <DefaultValuesWrapper userPreferences={preferences} />
        <Form.Alert />
        <div className="flex justify-end gap-6 py-4">
          <SubmitWithPending className="pointer-events-auto cursor-pointer rounded-2xl bg-lime-300 px-4 py-3 font-medium text-black">
            <div className="inline-flex items-center gap-1 transition-transform group-active:translate-y-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="var(--color-lime-800)"
                className="size-4"
              >
                <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
              </svg>
              <span>Add Recipe</span>
            </div>
          </SubmitWithPending>
        </div>
      </Form.Root>
    </>
  );
};

export default AddRecipePage;
