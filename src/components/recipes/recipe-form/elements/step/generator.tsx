"use client";

import * as Generator from "@/components/forms/generator";
import { FieldRoot } from "@/components/ui/controls/field-root";
import { Plus } from "@/components/ui/icons/plus";
import type { RecipeDetail } from "@/lib/domain/recipe/recipe";
import { useRef } from "react";
import { StepGeneratorItem } from "./item";

type StepsInputProps = {
  defaultValue?: RecipeDetail["steps"];
};

const StepsGenerator = ({ defaultValue }: StepsInputProps) => {
  const count = useRef(defaultValue?.length ?? 0);

  const defaultValueMap = new Map<number, string>(
    defaultValue?.map((value, index) => [index, value.description]),
  );

  return (
    <Generator.Root
      options={{
        initialKeys: defaultValue?.map((_, i) => i),
        generator: () => count.current++,
        openFirstWhenEmpty: true,
      }}
    >
      <ol>
        <Generator.Items>
          {(id, i) => {
            return (
              <li className="relative my-2" key={id}>
                <FieldRoot name={`step[]`}>
                  <StepGeneratorItem
                    id={id}
                    order={i + 1}
                    defaultValue={defaultValueMap.get(id as unknown as number)}
                  />
                </FieldRoot>
                <Generator.Add
                  after={i}
                  className="mx-auto my-4 flex cursor-pointer p-2 font-medium text-stone-600"
                >
                  <Plus />
                  <span className="pr-2">Add More</span>
                </Generator.Add>
              </li>
            );
          }}
        </Generator.Items>
      </ol>
    </Generator.Root>
  );
};

export { StepsGenerator };
