"use client";

import { v4 as uuid } from "uuid";
import * as Generator from "@/app/components/generator";
import * as Fieldset from "@/app/components/fieldset";
import { Plus } from "@/app/components/icon/plus";
import { IngredientGeneratorItem } from "./GeneratorItem";
import type { Recipe } from "@/lib/recipes/actions/read";
import type { Ingredient } from "@/lib/ingredients/actions/read";
import { useId } from "react";

type IngredientInputProps = {
  defaultValue?: Recipe["RecipeIngredient"];
  availableIngredients: Ingredient[];
};

const IngredientFieldset = ({
  defaultValue,
  availableIngredients,
}: IngredientInputProps) => {
  return (
    <Fieldset.Root name="ingredient">
      <Fieldset.Label>Ingredients</Fieldset.Label>

      <Generator.Root
        options={{
          generator: () => crypto.randomUUID(),
          initialKeys: defaultValue?.map(
            (ingredient) => ingredient.Ingredient.publicId,
          ),
          openFirstWhenEmpty: true,
        }}
      >
        <Generator.Items>
          {(uuid) => {
            const defaultValueOfItem = defaultValue?.find(
              (repIng) => repIng.Ingredient.publicId === uuid,
            );

            return (
              <IngredientGeneratorItem
                key={uuid}
                uuid={uuid}
                availableIngredients={availableIngredients}
                defaultValue={defaultValueOfItem}
              />
            );
          }}
        </Generator.Items>
        <Generator.Add>
          <Plus />
          <span className="pr-2">Add More</span>
        </Generator.Add>
      </Generator.Root>
    </Fieldset.Root>
  );
};

export { IngredientFieldset };
