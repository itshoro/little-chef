import * as Input from "@/app/components/input";
import { StepsGenerator } from "./elements/step/generator";
import { VisibilitySwitcher } from "@/app/(user)/settings/components/visibility-switcher";
import { ServingsInput } from "./elements/servings-input";
import * as Fieldset from "@/app/components/fieldset";
import type { Visibility } from "@/lib/dal/visibility";

type InputsProps = {
  defaultValue?: {
    recipe?: {
      name?: string;
      recommendedServingSize?: number;
      preparationTime?: number;
      cookingTime?: number;
      visibility?: Visibility;
    };
    steps?: {
      publicId: string;
      description: string;
      order: number;
    }[];
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
              defaultValue={defaultValue?.recipe?.name}
              required
            />
          </Input.Group>
        </Input.Root>
      </div>
      <div className="mb-8">
        <Input.Root name="visibility">
          <Input.Label>Visibility</Input.Label>
          <VisibilitySwitcher
            name={"visibility"}
            defaultValue={defaultValue?.recipe?.visibility}
          />
        </Input.Root>
      </div>
      <Fieldset.Root>
        <Fieldset.Label>Overview</Fieldset.Label>
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <Input.Root name="preparationTime">
              <Input.Label>Preparation time (in minutes)</Input.Label>
              <Input.Group>
                <Input.Element
                  type="text"
                  defaultValue={defaultValue?.recipe?.preparationTime}
                  pattern="\d+"
                  required
                />
              </Input.Group>
            </Input.Root>
          </div>
          <div className="flex-1">
            <Input.Root name="cookingTime">
              <Input.Label>Cooking time (in minutes)</Input.Label>
              <Input.Group>
                <Input.Element
                  type="text"
                  defaultValue={defaultValue?.recipe?.cookingTime}
                  pattern="\d+"
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
              defaultValue={defaultValue?.recipe?.recommendedServingSize}
              name="servings"
            />
          </div>
        </div>
        <CooklangInfo />
        <StepsGenerator defaultValue={defaultValue?.steps} />
      </Fieldset.Root>
    </>
  );
};

const CooklangInfo = () => {
  return (
    <div className="mb-6 mt-4 rounded-lg border bg-neutral-50 p-4 text-sm text-neutral-500">
      <p>
        Steps may be formated using the{" "}
        <a
          className="text-lime-500 underline"
          href="https://cooklang.org/docs/spec/"
        >
          Cooklang specification
        </a>
        . Doing so will allow for automatic scaling of ingredients needed for
        users.
      </p>
      <p className="mt-4">
        Try using{" "}
        <mark className="select-all rounded-lg border border-lime-200 bg-lime-100 p-1 text-lime-700">
          @eggs{"{"}2{"}"}
        </mark>{" "}
        or{" "}
        <mark className="select-all rounded-lg border border-lime-200 bg-lime-100 p-1 text-lime-700">
          #Cooking pan{"{"}1{"}"}
        </mark>{" "}
        below and see the result, once your recipe is stored!
      </p>
    </div>
  );
};

export { Inputs };
