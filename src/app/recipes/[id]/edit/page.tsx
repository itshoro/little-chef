import { get } from "@/lib/recipes/actions/retrieve";
import { RecipeForm } from "../../components/RecipeForm";
import { update } from "@/lib/recipes/actions/store";

type EditRecipePageProps = {
  params: {
    id: string;
  };
};

const EditRecipePage = async ({ params }: EditRecipePageProps) => {
  const recipe = await get(params.id);

  console.log(recipe);

  return (
    <RecipeForm preFill={recipe} action={update}>
      <RecipeForm.Submit>Save Changes</RecipeForm.Submit>
    </RecipeForm>
  );
};

export default EditRecipePage;
