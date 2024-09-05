import type { FormContext } from "@/app/components/form/root";
import { SubmitWithPending } from "@/app/components/form/submit-with-pending";
import * as Form from "@/app/recipes/components/recipe-form";
import { validateRequest } from "@/lib/auth/lucia";
import {
  getRecipe,
  getRecipeSteps,
  recipeDtoFromFormData,
  updateRecipe,
} from "@/lib/dal/recipe";
import { authorizeFromSession } from "@/lib/dal/user";
import { UpdateRecipeValidator } from "@/lib/dal/validators";
import { extractParts, generateSlugPathSegment } from "@/lib/slug";
import type { User } from "lucia";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

type EditRecipePageProps = {
  params: {
    slug: string;
  };
};

export const metadata: Metadata = {
  title: "Editing Recipe",
};

const EditRecipePage = async ({ params }: EditRecipePageProps) => {
  const { publicId } = extractParts(params.slug);
  const { user, session } = await validateRequest();

  if (!user) redirect("/login");

  try {
    const recipe = await getRecipe({ publicId }, user.publicId);
    const steps = await getRecipeSteps(recipe.id);

    return (
      <Form.Root action={update}>
        <div className="p-4">
          <input type="hidden" name="sessionId" value={session.id} />
          <input type="hidden" name="publicId" value={recipe.publicId} />
          <Form.Inputs defaultValue={{ recipe, steps }} />
        </div>
        <div>
          <div className="flex justify-end px-4">
            <SubmitWithPending className="group inline-flex items-center justify-center gap-2 rounded-full border p-4 text-sm font-medium shadow active:bg-neutral-100 active:shadow-inner disabled:pointer-events-none disabled:text-neutral-200 disabled:shadow-none dark:border-stone-700 dark:bg-stone-900 dark:text-white dark:active:bg-stone-700">
              <div className="inline-flex items-center gap-1 transition-transform group-active:translate-y-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="size-4"
                >
                  <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                </svg>
                Add Recipe
              </div>
            </SubmitWithPending>
          </div>
        </div>
      </Form.Root>
    );
  } catch (e) {
    if (e instanceof Error) {
      notFound();
    }
  }
};

async function update(_: FormContext, formData: FormData) {
  "use server";

  let user: User;
  try {
    const sessionId = formData.get("sessionId");
    user = await authorizeFromSession(sessionId);
  } catch {
    return {
      success: false,
      error: "You're currently not signed in, recipe update is disabled.",
    } satisfies FormContext;
  }

  const dto = recipeDtoFromFormData(formData, UpdateRecipeValidator);

  if (!dto.success) {
    return {
      success: false,
      error: Object.entries(
        dto.error.flatten((issue) => issue.message).fieldErrors,
      ).flatMap((kvp) => [`${kvp[0]}: ${kvp[1]}`]),
    } satisfies FormContext;
  }
  const recipe = await updateRecipe(dto.data, user);

  redirect(`/recipes/${generateSlugPathSegment(recipe.slug, recipe.publicId)}`);
}

export default EditRecipePage;
