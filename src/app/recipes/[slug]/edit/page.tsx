import { updateRecipe } from "@/lib/recipes/actions";
import { getRecipeEntity } from "@/lib/recipes/actions/read";
import * as RecipeForm from "../../../../(search)/recipes/components/RecipeForm/Form";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import RecipeLayout from "../layout";

type EditRecipePageProps = {
  params: {
    publicId: string;
  };
};

const EditRecipePage = async ({ params }: EditRecipePageProps) => {
  try {
    const recipe = await getRecipeEntity(params.publicId);

    return (
      <div className="flex flex-col">
        <div className="flex-1">
          <form action={updateRecipe}>
            <div className="p-4">
              <RecipeForm.Inputs defaultValue={recipe} />
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
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        notFound();
      }
    }
  }
};

export default EditRecipePage;
