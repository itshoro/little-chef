import { getRecipe, getRecipeSteps } from "@/lib/dal/recipe";
import * as RecipeForm from "@/app/recipes/components/recipe-form";
import { notFound } from "next/navigation";
import { extractParts } from "@/lib/slug";
import { validateRequest } from "@/lib/auth/lucia";

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
      <div className="flex flex-col">
        <div className="flex-1">
          <form>
            <div className="p-4">
              <RecipeForm.Inputs defaultValue={{ recipe, steps }} />
            </div>
          </form>
        </div>
        <footer
          className="flex w-full border-t p-4"
          style={{ gridArea: "action", gridColumn: 1 }}
        >
          <div className="ml-auto">
            <RecipeForm.Submit>Update Recipe</RecipeForm.Submit>
          </div>
        </footer>
      </div>
    );
  } catch (e) {
    if (e instanceof Error) {
      notFound();
    }
  }
};

export default EditRecipePage;
