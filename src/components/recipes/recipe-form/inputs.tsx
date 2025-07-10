// import * as Fieldset from "@/components/forms/fieldset";
import { VisibilitySwitcher } from "@/components/ui/controls/visibility-switcher";
import type {
  RecipeOutputPublicDTO,
  RecipeStepOutputPublicDTO,
} from "@/lib/services/recipe/types";
import { CoverImageInput } from "./elements/cover-image";
import { StepsGenerator } from "./elements/step/generator";
import { FieldRoot } from "@/components/ui/controls/field-root";
import { Input } from "@/components/ui/controls/input";
import { Label } from "@/components/ui/controls/label";
import { Textarea } from "@/components/ui/controls/textarea";
import { ServingsInput } from "@/components/ui/controls/servings-input";

type InputsProps = {
  defaultValue?: {
    recipe?: Partial<RecipeOutputPublicDTO>;
    steps?: RecipeStepOutputPublicDTO[];
  };
};

const Inputs = ({ defaultValue }: InputsProps) => {
  return (
    <>
      <div className="mb-8">
        <FieldRoot name="publicId">
          <Input type="hidden" value={defaultValue?.recipe?.publicId} />
        </FieldRoot>
        <div className="mb-4 rounded-2xl bg-stone-50 dark:bg-stone-950">
          <CoverImageInput defaultValue={defaultValue?.recipe?.coverSrc} />
        </div>
        <div className="mb-4">
          <FieldRoot name="name">
            <Label>Name</Label>
            <Input
              autoFocus
              type="text"
              defaultValue={defaultValue?.recipe?.name}
              required
            />
          </FieldRoot>
        </div>
        <div className="mb-4">
          <FieldRoot name="description">
            <Label>Description</Label>
            <Textarea
              className="min-h-24"
              defaultValue={defaultValue?.recipe?.description ?? undefined}
            />
          </FieldRoot>
        </div>

        <div className="mb-8">
          <FieldRoot name="visibility">
            <Label>Visibility</Label>
            <VisibilitySwitcher
              defaultValue={defaultValue?.recipe?.visibility}
            />
          </FieldRoot>
        </div>
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <FieldRoot name="preparationTime">
              <Label>Prep time (in mins)</Label>
              <Input
                type="text"
                defaultValue={defaultValue?.recipe?.preparationTime}
                pattern="\d+"
                required
              />
            </FieldRoot>
          </div>
          <div className="flex-1">
            <FieldRoot name="cookingTime">
              <Label>Cooking time (in mins)</Label>
              <Input
                type="text"
                defaultValue={defaultValue?.recipe?.cookingTime}
                pattern="\d+"
                required
              />
            </FieldRoot>
          </div>
        </div>
      </div>

      <div className="mb-3 flex flex-col items-baseline justify-between gap-4 sm:ml-auto sm:flex-row">
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <FieldRoot name="servings">
            <Label>Servings</Label>
            <ServingsInput
              defaultValue={defaultValue?.recipe?.recommendedServingSize}
            />
          </FieldRoot>
        </div>
      </div>
      <CooklangInfo />
      <StepsGenerator defaultValue={defaultValue?.steps} />
    </>
  );
};

const CooklangInfo = () => {
  return (
    <div className="mt-4 mb-6 rounded-lg border bg-neutral-50 p-4 text-sm text-neutral-500 dark:border-stone-700 dark:bg-stone-950">
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
        <mark className="rounded-lg border border-lime-200 bg-lime-100 p-1 text-lime-700 select-all dark:border-lime-900 dark:bg-lime-950 dark:text-lime-200">
          @eggs{"{"}2{"}"}
        </mark>{" "}
        or{" "}
        <mark className="rounded-lg border border-lime-200 bg-lime-100 p-1 text-lime-700 select-all dark:border-lime-900 dark:bg-lime-950 dark:text-lime-200">
          #Cooking pan{"{"}1{"}"}
        </mark>{" "}
        below and see the result, once your recipe is stored!
      </p>
    </div>
  );
};

export { Inputs };
