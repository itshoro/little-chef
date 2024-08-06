"use client";

import { useRef } from "react";

type ServingsInputProps = {
  defaultValue?: number;
  name?: string;
  min?: number;
  onChange?: React.ChangeEventHandler<React.ElementRef<"input">>;
};

const ServingsInput = ({
  name,
  onChange,
  defaultValue = 1,
  min = 1,
}: ServingsInputProps) => {
  const ref = useRef<React.ElementRef<"input">>(null);

  return (
    <div className="w-fit rounded-full border bg-stone-100 font-semibold transition focus-within:!border-green-600/40 focus-within:outline-4 focus-within:outline-green-400/10 dark:border-stone-700 dark:bg-stone-900">
      <div className="inline-flex">
        <button
          className="aspect-square h-12 select-none rounded-full active:bg-black/5 dark:active:bg-white/5"
          type="button"
          onClick={() => {
            if (!ref.current) return;
            ref.current.stepDown();
            // stepDown and stepUp don't trigger onChange automatically.
            ref.current.dispatchEvent(new Event("input", { bubbles: true }));
          }}
        >
          -
        </button>
        <input
          defaultValue={defaultValue ?? 1}
          type="number"
          name={name}
          min={min}
          step={0.5}
          ref={ref}
          className="min-w-[10ch] max-w-[12ch] border-none bg-transparent focus:ring-0"
          onChange={onChange}
        />
        <button
          className="aspect-square h-12 select-none rounded-full active:bg-black/5 dark:active:bg-white/5"
          type="button"
          onClick={() => {
            if (!ref.current) return;
            ref.current.stepUp();
            // stepDown and stepUp don't trigger onChange automatically.
            ref.current.dispatchEvent(new Event("input", { bubbles: true }));
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

export { ServingsInput, type ServingsInputProps };
