import { Header } from "@/app/components/header/header";
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
import { BackLink } from "@/app/components/back-link";
import type { FormError } from "@/app/components/form/root";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Recipe",
};

const AddRecipePage = async () => {
  const { user } = await validateRequest();

  if (!user) redirect("/login");
  const preferences = await getRecipePreferences(user.publicId);

  return (
    <>
      <Header>
        <div className="flex items-center gap-2">
          <BackLink />
        </div>
      </Header>
      <div className="p-4">
        <Form.Root action={create}>
          <input type="hidden" name="publicUserId" value={user?.publicId} />
          <Form.Inputs
            defaultValue={{
              recipe: {
                recommendedServingSize: preferences?.defaultServingSize,
                visibility: preferences?.defaultVisibility,
              },
            }}
          />
          <div>
            <div className="flex justify-end px-4">
              <Form.Submit>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="size-4"
                >
                  <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                </svg>
                Add Recipe
              </Form.Submit>
            </div>
          </div>
        </Form.Root>
      </div>
    </>
  );
};

async function create(_: FormError, formData: FormData) {
  "use server";
  const publicUserId = formData.get("publicUserId");
  if (typeof publicUserId !== "string") {
    return {
      error: {
        message: "Public user id is missing.",
        target: "publicUserId",
      },
    } satisfies FormError;
  }

  const dto = recipeDtoFromFormData(formData, AddRecipeValidator);

  if (!dto.success) {
    const { fieldErrors } = dto.error.flatten();
    console.log(fieldErrors);
    const firstKey = Object.keys(fieldErrors).pop();
    return {
      error: {
        message: `${firstKey}: ${fieldErrors[firstKey as keyof typeof fieldErrors]![0]}`,
        target: firstKey!,
      },
    } satisfies FormError;
  }
  const recipe = await createRecipe(dto.data);
  await subscribeToRecipe(publicUserId, recipe, "creator");

  redirect(`/recipes/${generateSlugPathSegment(recipe.slug, recipe.publicId)}`);
}

export default AddRecipePage;
