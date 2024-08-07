"use client";

import * as Generator from "@/app/components/generator";
import * as Input from "@/app/components/input";
import { Trash } from "@/app/components/icon/trash";
import { useInputContext } from "@/app/components/input/context";
import { useDeferredValue, useEffect, useRef, useState } from "react";
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
        <div className="mb-4 ml-12 mt-3 text-sm">
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
  const textRef = useRef<React.ElementRef<"textarea">>(null);

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
              ref={textRef}
              value={value}
              onChange={onChange}
              maxLength={140}
              required
              autoFocus
            />
          </Input.Group>
        </Input.Root>
        <div className="group mb-auto ml-4 grid place-items-center">
          <Generator.Remove
            className="grid place-items-center rounded p-2.5 text-stone-500 transition-colors hover:bg-stone-100 disabled:bg-stone-200 dark:bg-stone-800 dark:disabled:bg-stone-700"
            uid={uuid}
          >
            <div title="Remove">
              <Trash />
            </div>
          </Generator.Remove>
          <div className="mt-2 text-stone-400 dark:text-stone-800">
            <CharacterCount textRef={textRef} />
          </div>
        </div>
      </Input.Root>
    </>
  );
};

const characterCountColorMap: Record<CharacterCountRegions, string> = {
  safe: "text-transparent",
  warning: "text-yellow-700",
  critical: "text-red-700",
};
const characterCountUpperBounds: Record<CharacterCountRegions, number> = {
  safe: Number.MAX_SAFE_INTEGER,
  warning: 50,
  critical: 20,
};

type CharacterCountRegions = "safe" | "warning" | "critical";

const CharacterCount = ({
  textRef,
}: {
  textRef: React.RefObject<React.ElementRef<"textarea">>;
}) => {
  const [remainingCharacters, setRemainingCharaters] = useState<number>(
    Number.MAX_SAFE_INTEGER,
  );
  const maxLength = useRef(Number.MAX_SAFE_INTEGER);

  useEffect(() => {
    textRef.current?.addEventListener("input", (e) => {
      const target = e.target as React.ElementRef<"textarea">;
      setRemainingCharaters(target.maxLength - target.value.length);
      maxLength.current = target.maxLength;
    });
  }, []);

  let notificationLevel: CharacterCountRegions = "safe";
  if (remainingCharacters < characterCountUpperBounds.warning)
    notificationLevel = "warning";
  if (remainingCharacters < characterCountUpperBounds.critical)
    notificationLevel = "critical";

  return (
    <div
      className={`invisible peer-focus-within:group-[]:visible ${characterCountColorMap[notificationLevel]}`}
    >
      <div className="relative flex items-center justify-center">
        <svg viewBox="0 0 20 20" className="size-7 -rotate-90 overflow-visible">
          <circle
            cx="50%"
            cy="50%"
            fill="none"
            r="10"
            stroke="currentColor"
            stroke-dasharray="63"
            stroke-dashoffset={
              63 - (63 * remainingCharacters) / maxLength.current
            }
            stroke-linecap="round"
            stroke-width="2"
          ></circle>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm">
            {remainingCharacters < 50 && remainingCharacters}
          </span>
        </div>
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
      className="m-2 h-8 w-8 flex-shrink-0 flex-grow-0 select-none rounded-full bg-neutral-100 text-sm font-bold dark:bg-stone-900"
      htmlFor={_name}
    >
      <div className="translate-y-1.5 text-center">{children}</div>
    </label>
  );
};

export { StepGeneratorItem };
