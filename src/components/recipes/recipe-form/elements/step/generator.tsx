"use client";

import * as Generator from "@/components/forms/generator";
import { Plus } from "@/components/ui/icons/plus";
import { StepGeneratorItem } from "./item";
import { FieldRoot } from "@/components/ui/controls/field-root";
import { Input } from "@/components/ui/controls/input";

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
                <FieldRoot name="step.uuid">
                  <Input type="hidden" value={uuid} />
                </FieldRoot>
                <FieldRoot name={`step.${uuid}`}>
                  <StepGeneratorItem
                    uuid={uuid}
                    order={i + 1}
                    defaultValue={
                      defaultValue?.find((item) => item.publicId === uuid)
                        ?.description
                    }
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
