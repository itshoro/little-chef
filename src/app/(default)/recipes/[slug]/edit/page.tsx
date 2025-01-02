import * as Form from "@/app/components/form";
import { SubmitWithPending } from "@/app/components/form/submit-with-pending";
import { validateRequest } from "@/lib/auth/lucia";
import { getRecipe, getRecipeSteps } from "@/lib/dal/recipe";
import { extractParts } from "@/lib/slug";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Inputs } from "../../components/recipe-form/inputs";
import { updateAction } from "./action";

type EditRecipePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const metadata: Metadata = {
  title: "Editing Recipe",
};

const EditRecipePage = async (props: EditRecipePageProps) => {
  const params = await props.params;
  const { publicId } = extractParts(params.slug);
  const { user, session } = await validateRequest();

  if (!user) redirect("/login");

  try {
    const recipe = await getRecipe({ publicId }, user.publicId);
    const steps = await getRecipeSteps(recipe.id);

    return (
      <Form.Root action={updateAction}>
        <div className="mx-auto max-w-(--breakpoint-xl) p-4">
          <input type="hidden" name="sessionId" value={session.id} />
          <input type="hidden" name="publicId" value={recipe.publicId} />
          <Inputs defaultValue={{ recipe, steps }} />
          <Form.Alert />
          <div>
            <div className="flex justify-end px-4">
              <SubmitWithPending className="group inline-flex items-center justify-center gap-2 rounded-full border p-4 text-sm font-medium shadow-sm active:bg-neutral-100 active:shadow-inner disabled:pointer-events-none disabled:text-neutral-200 disabled:shadow-none dark:border-stone-700 dark:bg-stone-900 dark:text-white dark:active:bg-stone-700">
                <div className="inline-flex items-center gap-1 transition-transform group-active:translate-y-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="size-4"
                  >
                    <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                  </svg>
                  Update Recipe
                </div>
              </SubmitWithPending>
            </div>
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

export default EditRecipePage;
