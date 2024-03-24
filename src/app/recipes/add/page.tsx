import { createRecipe } from "@/lib/recipes/actions";
import * as RecipeForm from "../components/RecipeForm/Form";
import { selectIngredients } from "@/lib/ingredients/actions/read";

const AddRecipePage = async () => {
  // const [state, action] = useFormState(
  //   createRecipe,
  //   initialState as never as Awaited<ReturnType<typeof createRecipe>>
  // );

  const ingredients = await selectIngredients("");

  return (
    <>
      <form action={createRecipe}>
        {/* {state.success === false && (
          <div className="fixed top-2 left-2 right-2 p-2 rounded-xl bg-red-200 text-red-600">
            {JSON.stringify(state.error)}
          </div>
        )} */}
        <div className="p-4">
          <RecipeForm.Inputs supportedIngredients={ingredients} />
        </div>
        <div>
          <div className="flex justify-end px-4">
            <RecipeForm.Submit>Add Recipe</RecipeForm.Submit>
          </div>
        </div>
      </form>
      <footer
        className="isolate sticky bottom-0 z-10"
        style={{ gridArea: "action", gridColumn: 1 }}
      >
        <div className="bg-emerald-700 text-white px-4 py-2 text-sm font-medium mt-2 rounded-t-xl">
          <div className="flex gap-2">
            <div>Add</div>
            <span className="select-none text-emerald-500">/</span>
            <div className="text-emerald-200">Recipes</div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default AddRecipePage;
