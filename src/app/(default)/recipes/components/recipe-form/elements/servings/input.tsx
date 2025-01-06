"use client";

import { useRef } from "react";
import * as Input from "@/app/components/input";

type ServingsInputProps = {
  defaultValue?: number;
  min?: number;
  onChange?: React.ChangeEventHandler<React.ElementRef<"input">>;
};

const ServingsInput = ({
  onChange,
  defaultValue = 1,
  min = 1,
}: ServingsInputProps) => {
  const ref = useRef<React.ComponentRef<"input">>(null);

  return (
    <Input.Group className="w-full min-w-0 rounded-full">
      <span data-slot="icon" className="p-1">
        <button
          className="grid size-10 place-items-center rounded-lg border-stone-200 bg-white font-semibold text-stone-500 shadow-sm select-none active:border active:shadow-inner active:*:translate-y-px dark:border dark:border-stone-700 dark:bg-stone-800 dark:active:bg-stone-700"
          type="button"
          onClick={() => {
            ref.current?.stepDown();
            // stepDown and stepUp don't trigger onChange automatically.
            ref.current?.dispatchEvent(new Event("input", { bubbles: true }));
          }}
          tabIndex={-1}
        >
          <span className="transform">-</span>
        </button>
      </span>
      <Input.Element
        defaultValue={defaultValue ?? 1}
        type="number"
        required={true}
        min={min}
        step={0.5}
        ref={ref}
        className="w-full flex-1 rounded-xl"
        onChange={onChange}
        style={{ paddingInline: "calc(var(--spacing) * 14)" }}
      />
      <span data-slot="icon" className="p-1">
        <button
          className="grid size-10 place-items-center rounded-lg border-stone-200 bg-white font-semibold text-stone-500 shadow-sm select-none active:border active:shadow-inner active:*:translate-y-px dark:border dark:border-stone-700 dark:bg-stone-800 dark:active:bg-stone-700"
          type="button"
          onClick={() => {
            ref.current?.stepUp();
            // stepDown and stepUp don't trigger onChange automatically.
            ref.current?.dispatchEvent(new Event("input", { bubbles: true }));
          }}
          tabIndex={-1}
        >
          <span className="transform">+</span>
        </button>
      </span>
    </Input.Group>
  );
};

export { ServingsInput, type ServingsInputProps };
