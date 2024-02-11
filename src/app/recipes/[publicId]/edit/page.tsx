import { getRecipe, updateRecipe } from "@/lib/recipes/actions";
import * as RecipeForm from "../../components/RecipeForm";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import type { Recipe } from "@/lib/recipes/actions/read";

type EditRecipePageProps = {
  params: {
    publicId: string;
  };
};

const EditRecipePage = async ({ params }: EditRecipePageProps) => {
  try {
    const recipe = await getRecipe(params.publicId);

    return (
      <>
        <form action={updateRecipe}>
          <div className="p-4">
            <RecipeForm.Inputs preFill={recipe} />
          </div>
          <div>
            <div className="flex justify-end px-4">
              <RecipeForm.Submit>Update Recipe</RecipeForm.Submit>
            </div>
          </div>
        </form>
        <footer
          className="isolate sticky bottom-0 z-10"
          style={{ gridArea: "action", gridColumn: 1 }}
        >
          <div>
            <div className="flex justify-end px-4"></div>
          </div>
          <div className="bg-emerald-700 text-white px-4 py-2 text-sm font-medium mt-2 rounded-t-xl">
            <div className="flex gap-2">
              <div>Edit</div>
              <span className="select-none text-emerald-500">/</span>
              <div className="text-emerald-200">{recipe?.name}</div>
              <span className="select-none text-emerald-500">/</span>
              <div className="text-emerald-200">Recipes</div>
            </div>
          </div>
        </footer>
      </>
    );
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        notFound();
      }
    }
  }
};

export default EditRecipePage;
