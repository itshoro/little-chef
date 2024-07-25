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

type EditRecipePageProps = {
  params: {
    slug: string;
  };
};

const EditRecipePage = async ({ params }: EditRecipePageProps) => {
  const { publicId } = extractParts(params.slug);
  const { session } = await validateRequest();

  try {
    const recipe = await getRecipe({ publicId }, session?.id);
    const steps = await getRecipeSteps(recipe.id);

    return (
      <Form.Root action={update}>
        <div className="p-4">
          <input type="hidden" name="sessionId" value={session?.id} />
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

async function update(formData: FormData) {
  "use server";

  const sessionId = formData.get("sessionId");
  if (typeof sessionId !== "string") throw new Error("SessionId is missing.");

  const dto = recipeDtoFromFormData(formData, UpdateRecipeValidator);

  if (!dto.success) {
    throw new Error("Recipe DTO couldn't be updated.", {
      cause: dto.error.flatten(),
    });
  }
  const recipe = await updateRecipe(dto.data);

  redirect(
    `/recipes/${generateSlugPathSegment(recipe.slug, recipe.publicId)}/overview`,
  );
}

export default EditRecipePage;
