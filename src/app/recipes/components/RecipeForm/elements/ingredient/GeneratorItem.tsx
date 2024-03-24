"use client";

import * as Input from "@/app/components/input";
import * as Generator from "@/app/components/generator";
import { IngredientSelect } from "./Select";
import { Trash } from "@/app/components/icon/trash";
import type { Recipe } from "@/lib/recipes/actions/read";
import type { Ingredient } from "@/lib/ingredients/actions/read";

type IngredientInputProps = {
  uuid: string;
  availableIngredients: Ingredient[];
  defaultValue?: Recipe["RecipeIngredient"][number];
};

const IngredientGeneratorItem = ({
  uuid,
  availableIngredients,
  defaultValue,
}: IngredientInputProps) => {
  return (
    <>
      <Input.Root name="uuid">
        <Input.Element type="hidden" value={uuid} />
      </Input.Root>

      <Input.Root name={uuid} key={uuid}>
        <div className="flex gap-4 mb-2">
          <div className="flex-[3]">
            <Input.Root name="publicId">
              <Input.Label>Type</Input.Label>
              <IngredientSelect availableIngredients={availableIngredients} />
            </Input.Root>
          </div>

          <div className="flex-[2]">
            <Input.Root name="measurement">
              <Input.Label htmlFor="amount">Amount</Input.Label>
              <Input.Group>
                <Input.Element
                  type="text"
                  name="amount"
                  defaultValue={defaultValue?.measurementAmount}
                  required
                />

                <div>
                  <Input.Label key={uuid} htmlFor="unit" className="sr-only">
                    Measurement
                  </Input.Label>
                </div>
                <div className="p-1 h-full">
                  <Input.Select
                    name="unit"
                    defaultValue={defaultValue?.measurementUnit}
                    required
                  >
                    <option>pcs</option>
                    <option>mg</option>
                    <option>g</option>
                    <option>ml</option>
                    <option>l</option>
                  </Input.Select>
                </div>
              </Input.Group>
            </Input.Root>
          </div>

          <Generator.Remove
            className="grid place-items-center disabled:bg-stone-200 hover:bg-stone-100 text-stone-500 p-2.5 mt-[1.5rem] rounded transition-colors"
            uid={uuid}
          >
            <div title="Remove">
              <Trash />
            </div>
          </Generator.Remove>
        </div>
      </Input.Root>
    </>
  );
};

export { IngredientGeneratorItem };
