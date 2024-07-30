"use client";

import * as Generator from "@/app/components/generator";
import { Plus } from "@/app/components/icon/plus";
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
              <StepGeneratorItem
                key={uuid}
                uuid={uuid}
                order={i + 1}
                defaultValue={defaultValue?.[i]?.description}
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
  );
};

export { StepsGenerator };
