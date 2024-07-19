import * as Input from "@/app/components/input";
import { StepsGenerator } from "./elements/step/generator";
import { VisibilitySwitcher } from "@/app/(user)/settings/components/visibility-switcher";
import { findIngredients } from "@/lib/dal/ingredients";
import { ServingsInput } from "./elements/servings-input";
import * as Fieldset from "@/app/components/fieldset";
import type { Visibility } from "@/lib/dal/visibility";

type InputsProps = {
  defaultValue?: {
    name?: string;
    servings?: number;
    preparationTime?: string;
    cookingTime?: string;
    visibility?: Visibility;
    languageCode?: string;
  };
};

const Inputs = ({ defaultValue }: InputsProps) => {
  return (
    <>
      <div className="mb-4">
        <Input.Root name="name">
          <Input.Label>Name</Input.Label>
          <Input.Group>
            <Input.Element
              autoFocus
              type="text"
              defaultValue={defaultValue?.name}
              required
            />
          </Input.Group>
        </Input.Root>
      </div>
      <div className="mb-8">
        <Input.Root name="visibility">
          <Input.Label>Visibility</Input.Label>
          <div className="rounded-xl border border-neutral-200">
            <VisibilitySwitcher
              name={"visibility"}
              defaultValue={defaultValue?.visibility}
            />
          </div>
        </Input.Root>
      </div>
      <Fieldset.Root>
        <Fieldset.Label>Overview</Fieldset.Label>
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <Input.Root name="preparationTime">
              <Input.Label>Preparation time</Input.Label>
              <Input.Group>
                <Input.Element
                  type="text"
                  defaultValue={defaultValue?.preparationTime}
                  pattern="\d{2}:\d{2}"
                  required
                />
              </Input.Group>
            </Input.Root>
          </div>
          <div className="flex-1">
            <Input.Root name="cookingTime">
              <Input.Label>Cooking time</Input.Label>
              <Input.Group>
                <Input.Element
                  type="text"
                  defaultValue={defaultValue?.cookingTime}
                  pattern="\d{2}:\d{2}"
                  required
                />
              </Input.Group>
            </Input.Root>
          </div>
        </div>
      </Fieldset.Root>

      <Fieldset.Root>
        <div className="flex items-baseline">
          <Fieldset.Label>Steps</Fieldset.Label>

          <div className="mb-3 ml-auto flex items-center gap-4">
            <span className="text-sm font-medium text-stone-600">Servings</span>
            <ServingsInput
              defaultValue={defaultValue?.servings}
              name="servings"
            />
          </div>
        </div>
      </Fieldset.Root>
      {/* <IngredientSelect action={findIngredientsAction} /> */}

      {/* <IngredientsFieldset /> */}

      <StepsGenerator />
    </>
  );
};

async function findIngredientsAction(query: string) {
  "use server";
  const ingredients = await findIngredients(query, "en");

  return ingredients.map((ingredient) => ({
    id: ingredient.ingredients.publicId,
    name: ingredient.name.value,
  }));
}

const IngredientsFieldset = () => {
  return null;
  // <>
  //   <Input.Root name="uuid">
  //     <Input.Element type="hidden" value={uuid} />
  //   </Input.Root>

  //   <Input.Root name={uuid} key={uuid}>
  //     <div className="mb-2 flex gap-4">
  //       <div className="flex-[3]">
  //         <Input.Root name="publicId">
  //           <Input.Label>Type</Input.Label>
  //           <IngredientSelect availableIngredients={availableIngredients} />
  //         </Input.Root>
  //       </div>

  //       <div className="flex-[2]">
  //         <Input.Root name="measurement">
  //           <Input.Label htmlFor="amount">Amount</Input.Label>
  //           <Input.Group>
  //             <Input.Element
  //               type="text"
  //               name="amount"
  //               defaultValue={defaultValue?.measurementAmount}
  //               required
  //             />

  //             <div>
  //               <Input.Label key={uuid} htmlFor="unit" className="sr-only">
  //                 Measurement
  //               </Input.Label>
  //             </div>
  //             <div className="h-full p-1">
  //               <Input.Select
  //                 name="unit"
  //                 defaultValue={defaultValue?.measurementUnit}
  //                 required
  //               >
  //                 <option>pcs</option>
  //                 <option>mg</option>
  //                 <option>g</option>
  //                 <option>ml</option>
  //                 <option>l</option>
  //               </Input.Select>
  //             </div>
  //           </Input.Group>
  //         </Input.Root>
  //       </div>

  //       <Generator.Remove
  //         className="mt-[1.5rem] grid place-items-center rounded p-2.5 text-stone-500 transition-colors hover:bg-stone-100 disabled:bg-stone-200"
  //         uid={uuid}
  //       >
  //         <div title="Remove">
  //           <Trash />
  //         </div>
  //       </Generator.Remove>
  //     </div>
  //   </Input.Root>
  // </>
};

export { Inputs };
