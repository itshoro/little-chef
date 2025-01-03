"use client";

import * as Generator from "@/app/components/generator";
import { Plus } from "@/app/components/icon/plus";
import * as Input from "@/app/components/input";
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
              <Input.Root key={uuid} name="step">
                <StepGeneratorItem
                  uuid={uuid}
                  order={i + 1}
                  defaultValue={
                    defaultValue?.find((item) => item.publicId === uuid)
                      ?.description
                  }
                />
              </Input.Root>
            );
          }}
        </Generator.Items>
      </ol>
      <Generator.Add className="ml-auto flex cursor-pointer font-medium text-stone-600">
        <Plus />
        <span className="pr-2">Add More</span>
      </Generator.Add>
    </Generator.Root>
  );
};

export { StepsGenerator };
