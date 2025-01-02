"use client";

import * as Generator from "@/app/components/generator";
import { Plus } from "@/app/components/icon/plus";
import { StepGeneratorItem } from "./item";
import { useFormStateContext } from "@/app/components/form/root";
import { useInputContext } from "@/app/components/input/context";

type StepsInputProps = {
  defaultValue?: { publicId: string; description: string; order: number }[];
};

const StepsGenerator = ({ defaultValue }: StepsInputProps) => {
  const formState = useFormStateContext(StepsGenerator.name);
  const inputContext = useInputContext(StepsGenerator.name);

  // When submission fails, we want to reset the form to the previous state
  const _defaultValue = !formState.success
    ? (formState.controls?.["step.uuid"] as string[] | undefined)?.map(
        (uuid) => ({
          publicId: uuid,
        }),
      )
    : defaultValue;

  return (
    <Generator.Root
      options={{
        initialKeys: _defaultValue?.map((step) => step.publicId),
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
      <Generator.Add className="ml-auto flex cursor-pointer font-medium text-stone-600">
        <Plus />
        <span className="pr-2">Add More</span>
      </Generator.Add>
    </Generator.Root>
  );
};

export { StepsGenerator };
