"use client";

import { getNumericValue, type Ingredient } from "@cooklang/cooklang";
import { useSearchParams } from "next/navigation";
import { AmountItem } from "./amount-item";

type IngredientListProps = {
  ingredients: Ingredient[];
  recommendedServingSize: number;
};

const IngredientList = ({
  ingredients,
  recommendedServingSize,
}: IngredientListProps) => {
  const searchParams = useSearchParams();
  const preferredServingSize = Number(
    searchParams.get("servings") || recommendedServingSize,
  );

  return (
    <ul className="grid gap-2">
      {ingredients.map((ingredient) => (
        <li key={ingredient.name}>
          <AmountItem
            label={ingredient.name}
            amount={[
              ingredient.quantity?.scalable
                ? (getNumericValue(ingredient.quantity?.value)?.valueOf() ??
                    0) * preferredServingSize
                : (getNumericValue(ingredient.quantity?.value)?.valueOf() ?? 0),
              ingredient.quantity?.unit,
            ]
              .filter((x) => x)
              .join(" ")}
          />
        </li>
      ))}
    </ul>
  );
};

export { IngredientList, type IngredientListProps };
