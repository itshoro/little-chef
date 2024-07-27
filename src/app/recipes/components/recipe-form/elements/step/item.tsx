"use client";

import * as Generator from "@/app/components/generator";
import * as Input from "@/app/components/input";
import { Trash } from "@/app/components/icon/trash";
import { useInputContext } from "@/app/components/input/context";
import { useDeferredValue, useState } from "react";
import { CooklangPreview } from "@/app/recipes/[slug]/components/cooklang-preview";

type StepGeneratorItemProps = {
  uuid: string;
  order: number;
  defaultValue?: string;
};

const StepGeneratorItem = ({
  uuid,
  order,
  defaultValue,
}: StepGeneratorItemProps) => {
  const [input, setInput] = useState(defaultValue);
  const deferredInput = useDeferredValue(input);

  return (
    <li key={uuid} className="relative my-2">
      <div>
        <div className="flex">
          <InputMask
            uuid={uuid}
            order={order}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="mb-4 ml-12 mt-3">
          <div className="pb-1 text-xs text-neutral-400">Preview</div>
          <CooklangPreview value={deferredInput} />
        </div>
      </div>
      <span
        style={{ height: "calc(100% - 3rem)" }}
        className="absolute left-6 top-12 w-px bg-neutral-200"
      />
    </li>
  );
};

type InputMaskProps = {
  uuid: StepGeneratorItemProps["uuid"];
  order: StepGeneratorItemProps["order"];
  value: string | undefined;
  onChange: React.ChangeEventHandler<React.ElementRef<"textarea">>;
};

const InputMask = ({ uuid, order, value, onChange }: InputMaskProps) => {
  return (
    <>
      <Input.Root name="step">
        <Input.Root name="uuid">
          <Input.Element type="hidden" value={uuid} />
        </Input.Root>
        <Input.Root name={uuid}>
          <StepCounterLabel>{order}</StepCounterLabel>
          <Input.Group>
            <Input.Textarea
              value={value}
              onChange={onChange}
              maxLength={140}
              required
              autoFocus
            />
          </Input.Group>
        </Input.Root>
        <Generator.Remove
          className="mb-auto ml-4 grid place-items-center rounded p-2.5 text-stone-500 transition-colors hover:bg-stone-100 disabled:bg-stone-200"
          uid={uuid}
        >
          <div title="Remove">
            <Trash />
          </div>
        </Generator.Remove>
      </Input.Root>
    </>
  );
};

const StepCounterLabel = ({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children?: React.ReactNode;
}) => {
  const { name } = useInputContext(StepCounterLabel.name);

  const _name = htmlFor ? `${name}.${htmlFor}` : name;

  return (
    <label
      className="m-2 h-8 w-8 flex-shrink-0 flex-grow-0 select-none rounded-full bg-neutral-100 text-sm font-bold"
      htmlFor={_name}
    >
      <div className="translate-y-1.5 text-center">{children}</div>
    </label>
  );
};

export { StepGeneratorItem };
