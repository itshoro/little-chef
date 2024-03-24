"use client";

import * as Fieldset from "@/app/components/fieldset";
import * as Generator from "@/app/components/generator";
import { v4 as uuid } from "uuid";
import { Plus } from "@/app/components/icon/plus";
import type { Recipe } from "@/lib/recipes/actions/read";
import { StepGeneratorItem } from "./Item";
import { useId } from "react";

type StepsInputProps = {
  defaultValue?: Recipe["RecipeStep"];
};

const StepsInput = ({ defaultValue }: StepsInputProps) => {
  return (
    <Fieldset.Root>
      <Fieldset.Label>Steps</Fieldset.Label>
      <Generator.Root
        options={{
          initialKeys: defaultValue?.map((step) => step.Step.publicId),
          generator: () => crypto.randomUUID(),
          openFirstWhenEmpty: true,
        }}
      >
        <ol>
          <Generator.Items>
            {(uuid, i) => {
              return (
                <StepGeneratorItem
                  key={uuid}
                  uuid={uuid}
                  order={i + 1}
                  defaultValue={defaultValue?.[i]}
                />
              );
            }}
          </Generator.Items>
        </ol>
        <Generator.Add>
          <Plus />
          <span className="pr-2">Add More</span>
        </Generator.Add>
      </Generator.Root>
    </Fieldset.Root>
  );
};

export { StepsInput };
