import * as Form from "@/app/components/form";
import { SubmitWithPending } from "@/app/components/form/submit-with-pending";
import * as Input from "@/app/components/input";
import { validateRequest } from "@/lib/auth";
import { getRecipePreferences } from "@/lib/dal/recipe";
import type { Metadata } from "next";
import { DefaultValuesWrapper } from "../components/recipe-form/default-values-wrapper";
import { ServingsInputWithFormFallback } from "../components/recipe-form/elements/servings/input-with-form-fallback";
import { createAction } from "./action";

export const metadata: Metadata = {
  title: "Add Recipe",
};

const AddRecipePage = async () => {
  const { user, session } = await validateRequest();

  const preferences = user
    ? await getRecipePreferences(user.publicId)
    : undefined;

  return (
    <>
      {!user && (
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
