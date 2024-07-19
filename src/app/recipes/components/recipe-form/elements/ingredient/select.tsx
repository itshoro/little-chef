"use client";

import { Combobox } from "@/app/components/Combobox";
import { findIngredients } from "@/lib/dal/ingredients";
// import * as Input from "@/app/components/input";

const IngredientSelect = ({
  action,
}: {
  action: (query: string) => Promise<{ id: string; name: string }[]>;
}) => {
  return (
    <Combobox
      action={action}
      renderOption={(ingredient) => <div>{ingredient.name}</div>}
    />

    // <Input.SelectWithCombobox
    //   options={{
    //     items: availableIngredients,
    //     filter: (ingredient, searchValue) =>
    //       ingredient.name[0].name.includes(searchValue),
    //     renderOption: (ingredient) => ({
    //       label: ingredient.name[0].name,
    //       value: ingredient.publicId,
    //     }),
    //   }}
    // />
  );
};

export { IngredientSelect };
