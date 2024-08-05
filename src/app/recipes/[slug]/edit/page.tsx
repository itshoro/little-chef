import {
  getRecipe,
  getRecipeSteps,
  recipeDtoFromFormData,
  updateRecipe,
} from "@/lib/dal/recipe";
import * as Form from "@/app/recipes/components/recipe-form";
import { notFound, redirect } from "next/navigation";
import { extractParts, generateSlugPathSegment } from "@/lib/slug";
import { validateRequest } from "@/lib/auth/lucia";
import { UpdateRecipeValidator } from "@/lib/dal/validators";
import type { FormError } from "@/app/components/form/root";
import type { Metadata } from "next";

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
  const { user } = await validateRequest();

  if (!user) redirect("/login");

  try {
    const recipe = await getRecipe({ publicId }, user.publicId);
    const steps = await getRecipeSteps(recipe.id);

    return (
      <Form.Root action={update}>
        <div className="p-4">
          <input type="hidden" name="publicUserId" value={user.publicId} />
          <input type="hidden" name="publicId" value={recipe.publicId} />
          <Form.Inputs defaultValue={{ recipe, steps }} />
        </div>
        <div>
          <div className="flex justify-end px-4">
            <Form.Submit>Update Recipe</Form.Submit>
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

async function update(_: FormError, formData: FormData) {
  "use server";

  const publicUserId = formData.get("publicUserId");
  if (typeof publicUserId !== "string") {
    throw new Error("Public userId is missing.");
  }

  const dto = recipeDtoFromFormData(formData, UpdateRecipeValidator);

  if (!dto.success) {
    throw new Error("Recipe update dto is invalid.", {
      cause: { target: "general", details: dto.error.flatten() },
    });
  }
  const recipe = await updateRecipe(dto.data);

  redirect(`/recipes/${generateSlugPathSegment(recipe.slug, recipe.publicId)}`);
}

export default EditRecipePage;
