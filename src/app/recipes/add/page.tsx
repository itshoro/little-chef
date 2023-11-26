import { add } from "@/lib/recipes/actions/store";
import { RecipeForm } from "../components/RecipeForm";

const AddRecipePage = () => {
  return (
    <RecipeForm action={add}>
      <RecipeForm.Submit>Add Recipe</RecipeForm.Submit>
    </RecipeForm>
  );
};

export default AddRecipePage;
