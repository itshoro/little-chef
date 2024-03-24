import { selectIngredients } from "@/lib/ingredients/actions/read";
import { IngredientFieldset } from "./Wrapper";
import type { Recipe } from "@/lib/recipes/actions/read";

type IngredientFormElementProps = {
  defaultValue?: Recipe["RecipeIngredient"];
};

const IngredientFormElement = async ({
  defaultValue,
}: IngredientFormElementProps) => {
  const availableIngredients = await selectIngredients("");

  return (
    <IngredientFieldset
      defaultValue={defaultValue}
      availableIngredients={availableIngredients}
    />
  );
};

export { IngredientFormElement };
