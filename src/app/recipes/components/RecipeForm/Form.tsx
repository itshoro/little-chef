import * as Input from "@/app/components/input";
import { StepsInput } from "./elements/step/StepsInput";
import { IngredientFormElement } from "./elements/ingredient";
import type { Recipe } from "@/lib/recipes/actions/read";

type InputsProps = {
  defaultValue?: Recipe;
};

const Inputs = ({ defaultValue }: InputsProps) => {
  return (
    <section>
      <input type="hidden" value={defaultValue?.publicId} name="publicId" />

      <div className="mb-3">
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
      <div className="mb-3">
        <Input.Root name="servings">
          <Input.Label>Servings</Input.Label>
          <Input.Group>
            <Input.Element
              type="number"
              defaultValue={defaultValue?.servings}
              min={0}
              required
            />
          </Input.Group>
        </Input.Root>
      </div>
      <div className="mb-3">
        <Input.Root name="totalDuration">
          <Input.Label>Time needed</Input.Label>
          <Input.Group>
            <Input.Element
              type="text"
              defaultValue={defaultValue?.totalDuration ?? undefined}
              pattern="\d{2}:\d{2}"
              required
            />
          </Input.Group>
        </Input.Root>
      </div>
      <IngredientFormElement defaultValue={defaultValue?.RecipeIngredient} />
      <StepsInput defaultValue={defaultValue?.RecipeStep} />
    </section>
  );
};

const Submit = ({ children }: { children: React.ReactNode }) => (
  <button
    type="submit"
    className="inline-block group bg-gradient-to-t from-stone-100 border font-medium rounded-2xl active:shadow-inner shadow shadow-emerald-950/10 active:shadow-emerald-950/30 text-stone-700 transition-all"
  >
    <div className="group-active:translate-y-px transition inline-flex items-center p-2 pr-4">
      {children}
    </div>
  </button>
);

export { Submit, Inputs };
