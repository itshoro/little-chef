import * as Form from "@/app/components/form";
import { SubmitWithPending } from "@/app/components/form/submit-with-pending";
import { validateRequest } from "@/lib/auth";
import { getRecipe, getRecipeSteps } from "@/lib/dal/recipe";
import { extractParts } from "@/lib/slug";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Inputs } from "../../components/recipe-form/inputs";
import { editAction } from "./action";
import { isRateLimitedGlobally } from "@/lib/rate-limit/helper";

type EditRecipePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const metadata: Metadata = {
  title: "Editing Recipe",
};

const EditRecipePage = async (props: EditRecipePageProps) => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";

  const params = await props.params;
  const { publicId } = extractParts(params.slug);
  const { user, session } = await validateRequest();

  if (!user) redirect("/login");

  try {
    const recipe = await getRecipe({ publicId }, user.publicId);
    const steps = await getRecipeSteps(recipe.id);

    return (
      <Form.Root action={editAction}>
        <div className="mx-auto max-w-(--breakpoint-xl) p-4">
          <input type="hidden" name="sessionId" value={session.id} />
          <input type="hidden" name="publicId" value={recipe.publicId} />
          <Inputs defaultValue={{ recipe, steps }} />
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
                <span>Update Recipe</span>
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

export default EditRecipePage;
