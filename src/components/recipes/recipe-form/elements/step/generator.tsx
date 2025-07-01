"use client";

import * as Generator from "@/components/forms/generator";
import { Plus } from "@/components/ui/icons/plus";
import * as Input from "@/components/forms/input";
import { StepGeneratorItem } from "./item";

type StepsInputProps = {
  defaultValue?: { publicId: string; description: string; order: number }[];
};

const StepsGenerator = ({ defaultValue }: StepsInputProps) => {
  return (
    <Generator.Root
      options={{
        initialKeys: defaultValue?.map((step) => step.publicId),
        generator: () => crypto.randomUUID(),
        openFirstWhenEmpty: true,
      }}
    >
      <ol>
        <Generator.Items>
          {(uuid, i) => {
            return (
              <li className="relative my-2" key={uuid}>
                <Input.Root name="step">
                  <StepGeneratorItem
                    uuid={uuid}
                    order={i + 1}
                    defaultValue={
                      defaultValue?.find((item) => item.publicId === uuid)
                        ?.description
                    }
                  />
                  <Generator.Add
                    after={i}
                    className="mx-auto my-4 flex cursor-pointer p-2 font-medium text-stone-600"
                  >
                    <Plus />
                    <span className="pr-2">Add More</span>
                  </Generator.Add>
                </Input.Root>
              </li>
            );
          }}
        </Generator.Items>
      </ol>
    </Generator.Root>
  );
};

export { StepsGenerator };
