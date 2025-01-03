"use client";

import { CooklangPreview } from "@/app/(default)/recipes/[slug]/components/cooklang-preview";
import * as Generator from "@/app/components/generator";
import { Trash } from "@/app/components/icon/trash";
import * as Input from "@/app/components/input";
import { useInputContext } from "@/app/components/input/context";
import { useDeferredValue, useEffect, useRef, useState } from "react";

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
    <li className="relative my-2">
      <div>
        <div className="flex">
          <InputMask
            uuid={uuid}
            order={order}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="mt-3 mb-4 ml-12 text-sm">
          <div className="pb-1 text-xs text-neutral-400">Preview</div>
          <CooklangPreview value={deferredInput} />
        </div>
      </div>
      <span
        style={{ height: "calc(100% - 3rem)" }}
        className="absolute top-12 left-6 w-px bg-stone-100 dark:bg-stone-800"
      />
    </li>
  );
};

type InputMaskProps = {
  uuid: StepGeneratorItemProps["uuid"];
  order: StepGeneratorItemProps["order"];
  value: string | undefined;
  onChange: React.ChangeEventHandler<React.ComponentRef<"textarea">>;
};

const InputMask = ({ uuid, order, value, onChange }: InputMaskProps) => {
  const textRef = useRef<React.ComponentRef<"textarea">>(null);

  return (
    <>
      <Input.Root name="uuid">
        <Input.Element type="hidden" value={uuid} />
      </Input.Root>
      <Input.Root name={uuid}>
        <StepCounterLabel>{order}</StepCounterLabel>
        <div className="w-full flex-1">
          <Input.Textarea
            className="h-full w-full has-[~[data-slot=error]]:ring-red-500"
            ref={textRef}
            value={value}
            onChange={onChange}
            autoFocus={order > 1}
            maxLength={140}
            required
          />
          <Input.InlineError />
        </div>
      </Input.Root>
      <div className="group mb-auto ml-4 grid place-items-center">
        <Generator.Remove
          className="grid place-items-center rounded-sm p-2.5 text-stone-500 transition-colors disabled:bg-stone-200 dark:border dark:border-stone-700 dark:bg-stone-800 dark:active:not-disabled:bg-stone-700 dark:disabled:bg-stone-900 dark:disabled:text-stone-700"
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
      className={`invisible in-[.group]:peer-focus-within:visible ${characterCountColorMap[notificationLevel]}`}
    >
      <div className="relative flex items-center justify-center">
        <svg viewBox="0 0 20 20" className="size-7 -rotate-90 overflow-visible">
          <circle
            cx="50%"
            cy="50%"
            fill="none"
            r="10"
            stroke="currentColor"
            strokeDasharray="63"
            strokeDashoffset={
              63 - (63 * remainingCharacters) / maxLength.current
            }
            strokeLinecap="round"
            strokeWidth="2"
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
      className="m-2 h-8 w-8 shrink-0 grow-0 rounded-full bg-neutral-100 text-sm font-bold select-none dark:bg-stone-900"
      htmlFor={_name}
    >
      <div className="translate-y-1.5 text-center">{children}</div>
    </label>
  );
};

export { StepGeneratorItem };
