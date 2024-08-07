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
              <Input.Label>Prep time (in mins)</Input.Label>
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
              <Input.Label>Cooking time (in mins)</Input.Label>
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
        <div className="mb-3 flex flex-col items-baseline justify-between gap-4 sm:ml-auto sm:flex-row">
          <Fieldset.Label className="flex-shrink-0">Steps</Fieldset.Label>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="text-sm font-medium text-stone-600 dark:text-stone-400">
              Servings
            </div>
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
    <div className="mb-6 mt-4 rounded-lg border bg-neutral-50 p-4 text-sm text-neutral-500 dark:border-stone-700 dark:bg-stone-950">
      <p>
        Steps may be formated using the{" "}
        <a
          className="text-lime-500 underline"
          href="https://cooklang.org/docs/spec/"
          target="_blank"
        >
          Cooklang specification
        </a>
        . Doing so will allow for automatic scaling of ingredients needed for
        users.
      </p>
      <p className="mt-4">
        Try using{" "}
        <mark className="select-all rounded-lg border border-lime-200 bg-lime-100 p-1 text-lime-700 dark:border-lime-900 dark:bg-lime-950 dark:text-lime-200">
          @eggs{"{"}2{"}"}
        </mark>{" "}
        or{" "}
        <mark className="select-all rounded-lg border border-lime-200 bg-lime-100 p-1 text-lime-700 dark:border-lime-900 dark:bg-lime-950 dark:text-lime-200">
          #Cooking pan{"{"}1{"}"}
        </mark>{" "}
        below and see the result, once your recipe is stored!
      </p>
    </div>
  );
};

export { Inputs };
