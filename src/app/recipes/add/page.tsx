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
  const { user } = await validateRequest();
  const preferences = user
    ? await getRecipePreferences(user.publicId)
    : undefined;

  return (
    <Form.Root action={create}>
      <div className="p-4">
        <input type="hidden" name="publicUserId" value={user?.publicId} />
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
  const publicUserId = formData.get("publicUserId");
  if (typeof publicUserId !== "string") {
    throw new Error("Public user id is missing.");
  }

  const dto = recipeDtoFromFormData(formData, AddRecipeValidator);

  if (!dto.success) {
    throw new Error("Recipe DTO couldn't be created.", {
      cause: dto.error.flatten(),
    });
  }
  const recipe = await createRecipe(dto.data);
  await subscribeToRecipe(publicUserId, recipe, "creator");

  redirect(`/recipes/${generateSlugPathSegment(recipe.slug, recipe.publicId)}`);
}

export default AddRecipePage;
