"use client";

import * as Input from "../../../../../components/input";
import type { Ingredient } from "@/lib/ingredients/actions/read";

type IngredientSelectProps = {
  availableIngredients: Ingredient[];
};

const IngredientSelect = ({ availableIngredients }: IngredientSelectProps) => {
  return (
    <Input.SelectWithCombobox
      options={{
        items: availableIngredients,
        filter: (ingredient, searchValue) =>
          ingredient.name[0].name.includes(searchValue),
        renderOption: (ingredient) => ({
          label: ingredient.name[0].name,
          value: ingredient.publicId,
        }),
      }}
    />
  );
};

export { IngredientSelect };
