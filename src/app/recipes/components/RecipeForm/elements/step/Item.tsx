"use client";

import * as Generator from "@/app/components/generator";
import * as Input from "@/app/components/input";
import { Trash } from "@/app/components/icon/trash";
import type { Recipe } from "@/lib/recipes/actions/read";
import { useInputContext } from "@/app/components/input/Context";

type StepGeneratorItemProps = {
  uuid: string;
  order: number;
  defaultValue?: Recipe["RecipeStep"][number];
};

const StepGeneratorItem = ({
  uuid,
  order,
  defaultValue,
}: StepGeneratorItemProps) => {
  return (
    <li key={uuid} className="flex my-2">
      <Input.Root name="step">
      <Input.Root name="uuid">

      <Input.Element type="hidden" value={uuid} />
      </Input.Root>
      <Input.Root name={uuid}>
      <StepCounterLabel>{order}.</StepCounterLabel>
      <Input.Group>
      <Input.Textarea
              defaultValue={defaultValue?.Step.description}
              maxLength={140}
              required
              autoFocus
      />
      </Input.Group>
      {/* <textarea
        className="p-2 rounded-lg hover:bg-stone-100 hover:border-stone-100 focus:bg-stone-100 focus:border-stone-100 border font-medium w-full transition"
        name={`step.${uuid}`}
        id={uuid}
        defaultValue={defaultValue?.Step.description}
        maxLength={140}
        required
        autoFocus
      /> */}
      </Input.Root>
      <Generator.Remove
        className="grid place-items-center ml-4 mb-auto disabled:bg-stone-200 hover:bg-stone-100 text-stone-500 p-2.5 rounded transition-colors"
        uid={uuid}
      >
        <div title="Remove">
          <Trash />
        </div>
      </Generator.Remove>
      </Input.Root>

    </li>
  );
};

const StepCounterLabel = ({ htmlFor, children }: { htmlFor?: string, children?: React.ReactNode}) => {
  const {name} = useInputContext(StepCounterLabel.name);

  const _name = htmlFor ? `${name}.${htmlFor}` : name;

  return       <label
  className="select-none text-sm bg-green-700/10 text-green-800 font-bold w-8 h-8 rounded-full flex-grow-0 flex-shrink-0 m-2"
  htmlFor={_name}
>
  <div className="text-center translate-y-1.5">{children}</div>
</label>
}

export { StepGeneratorItem };
