"use client";

import * as Generator from "@/app/components/generator";
import * as Input from "@/app/components/input";
import { Trash } from "@/app/components/icon/trash";
import { useInputContext } from "@/app/components/input/Context";
import { useDeferredValue, useRef, useState } from "react";
import { Parser } from "@cooklang/cooklang-ts";

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
        <div className="mb-4 mt-3">
          <PreviewMask value={deferredInput} />
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

const PreviewMask = ({ value }: { value?: string }) => {
  const parserRef = useRef<Parser>();
  if (parserRef.current === undefined) {
    parserRef.current = new Parser();
  }

  const parsedResult = value ? parserRef.current.parse(value).steps : [];

  if (parsedResult.length === 0) return null;
  const previewData = parsedResult.pop();

  return (
    <div className="ml-12">
      <div className="pb-1 text-xs text-neutral-400">Preview</div>
      <div>
        {previewData?.map((segment) => {
          switch (segment.type) {
            case "text":
              return <span>{segment.value}</span>;
            case "ingredient":
              return (
                <span className="inline-flex divide-x rounded-full bg-neutral-100 px-2">
                  <span className="px-2 py-2">
                    {segment.quantity}
                    {segment.units}
                  </span>
                  <span className="px-2 py-2">{segment.name}</span>
                </span>
              );
            case "cookware":
              return (
                <span>
                  {segment.quantity} {segment.name}
                </span>
              );
            case "timer":
              return (
                <span>
                  <time dateTime={`P${segment.quantity}`}>
                    {segment.quantity} {segment.units}
                  </time>
                </span>
              );
          }
        })}
      </div>
    </div>
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
