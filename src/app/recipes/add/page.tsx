import * as Form from "../components/recipe-form";
import { validateRequest } from "@/lib/auth/lucia";
import {
  createRecipe,
  recipeDtoFromFormData,
  getRecipePreferences,
} from "@/lib/dal/recipe";
import { subscribeToRecipe } from "@/lib/dal/user";
import { AddRecipeValidator } from "@/lib/dal/validators";
import { generateSlugPathSegment } from "@/lib/slug";
import { redirect } from "next/navigation";

const AddRecipePage = async () => {
  const { session } = await validateRequest();
  const preferences = session
    ? await getRecipePreferences(session.id)
    : undefined;

  return (
    <Form.Root action={create}>
      <div className="p-4">
        <input type="hidden" name="sessionId" value={session?.id} />
        <Form.Inputs
          defaultValue={{
            recipe: {
              recommendedServingSize: preferences?.defaultServingSize,
              visibility: preferences?.defaultVisibility,
            },
          }}
        />
      </div>
      <div>
        <div className="flex justify-end px-4">
          <Form.Submit>Add Recipe</Form.Submit>
        </div>
      </div>
    </Form.Root>
  );
};

async function create(formData: FormData) {
  "use server";

  const sessionId = formData.get("sessionId");
  if (typeof sessionId !== "string") throw new Error("SessionId is missing.");

  const dto = recipeDtoFromFormData(formData, AddRecipeValidator);

  if (!dto.success) {
    throw new Error("Recipe DTO couldn't be created.", {
      cause: dto.error.flatten(),
    });
  }
  const recipe = await createRecipe(dto.data);
  await subscribeToRecipe(sessionId, recipe, "creator");

  redirect(`/recipes/${generateSlugPathSegment(recipe.slug, recipe.publicId)}`);
}

export default AddRecipePage;
