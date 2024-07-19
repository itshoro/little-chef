import { selectIngredients } from "@/lib/ingredients/actions/read";
import { IngredientFieldset } from "./wrapper";

type IngredientFormElementProps = {
  defaultValue?: Prisma.RecipeGetPayload<{
    include: { RecipeIngredient: { include: { Ingredient: true } } };
  }>["RecipeIngredient"];
};

const IngredientFormElement = async ({
  defaultValue,
}: IngredientFormElementProps) => {
  // const availableIngredients = await selectIngredients("");

  return (
    <IngredientFieldset defaultValue={defaultValue} availableIngredients={[]} />
  );
};

export { IngredientFormElement };
