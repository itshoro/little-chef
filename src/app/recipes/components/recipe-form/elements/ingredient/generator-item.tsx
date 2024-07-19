import * as Input from "@/app/components/input";
import * as Generator from "@/app/components/generator";
import { IngredientSelect } from "./select";
import { Trash } from "@/app/components/icon/trash";
import type { Prisma } from "@prisma/client";

type IngredientInputProps = {
  uuid: string;
  availableIngredients: Prisma.IngredientGetPayload<{
    include: { name: true };
  }>[];
  defaultValue?: Prisma.RecipeGetPayload<{
    include: { RecipeIngredient: true };
  }>["RecipeIngredient"][number];
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
        <div className="mb-2 flex gap-4">
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
                <div className="h-full p-1">
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
            className="mt-[1.5rem] grid place-items-center rounded p-2.5 text-stone-500 transition-colors hover:bg-stone-100 disabled:bg-stone-200"
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
