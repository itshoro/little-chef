import { BackLink } from "@/app/components/back-link";
import type { FormContext } from "@/app/components/form/root";
import { SubmitWithPending } from "@/app/components/form/submit-with-pending";
import { Header } from "@/app/components/header/header";
import { validateRequest } from "@/lib/auth/lucia";
import {
  createRecipe,
  getRecipePreferences,
  recipeDtoFromFormData,
} from "@/lib/dal/recipe";
import { authorizeFromSession, subscribeToRecipe } from "@/lib/dal/user";
import { AddRecipeValidator } from "@/lib/dal/validators";
import { generateSlugPathSegment } from "@/lib/slug";
import type { User } from "lucia";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import * as Form from "../components/recipe-form";

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
      <Form.Root action={create}>
        <input type="hidden" name="sessionId" value={session?.id} />
        <Form.Inputs
          defaultValue={{
            recipe: {
              recommendedServingSize: preferences?.defaultServingSize ?? 1,
              visibility: preferences?.defaultVisibility ?? "private",
            },
          }}
        />
        <div className="flex justify-end py-4">
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

async function create(_: FormContext, formData: FormData) {
  "use server";
  let user: User;
  try {
    const sessionId = formData.get("sessionId");
    user = await authorizeFromSession(sessionId);
  } catch {
    return {
      success: false,
      error: "You're currently not signed in, recipe creation is disabled.",
    } satisfies FormContext;
  }

  if (!user) {
    return {
      success: false,
      error: "You're currently not signed in, recipe creation is disabled.",
    } satisfies FormContext;
  }

  const dto = recipeDtoFromFormData(formData, AddRecipeValidator);

  if (!dto.success) {
    return {
      success: false,
      error: Object.entries(
        dto.error.flatten((issue) => issue.message).fieldErrors,
      ).flatMap((kvp) => [`${kvp[0]}: ${kvp[1]}`]),
    } satisfies FormContext;
  }
  const recipe = await createRecipe(dto.data);
  await subscribeToRecipe(user.publicId, recipe, "creator");

  redirect(`/recipes/${generateSlugPathSegment(recipe.slug, recipe.publicId)}`);
}

export default AddRecipePage;
