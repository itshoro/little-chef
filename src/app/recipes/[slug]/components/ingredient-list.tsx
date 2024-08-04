"use client";

import { Ingredient } from "@cooklang/cooklang-ts";
import { AmountItem } from "./amount-item";
import { useSearchParams } from "next/navigation";

type IngredientListProps = {
  ingredients: Ingredient[];
  recommendedServingSize: number;
};

const IngredientList = ({
  ingredients,
  recommendedServingSize,
}: IngredientListProps) => {
  const searchParams = useSearchParams();
  const preferredServingSize = Number(searchParams.get("servings"));

  return (
    <ul className="grid gap-2">
      {ingredients.map((ingredient) => (
        <li key={ingredient.name}>
          <AmountItem
            label={ingredient.name}
            amount={
              typeof ingredient.quantity === "number"
                ? (ingredient.quantity / recommendedServingSize) *
                    preferredServingSize +
                  ingredient.units
                : ingredient.quantity + ingredient.units
            }
          />
        </li>
      ))}
    </ul>
  );
};

export { IngredientList, type IngredientListProps };
