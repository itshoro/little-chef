"use client";

import { useRef } from "react";

type ServingsInputProps = {
  defaultValue?: number;
  name?: string;
};

const ServingsInput = ({ defaultValue, name }: ServingsInputProps) => {
  const ref = useRef<React.ElementRef<"input">>(null);

  return (
    <div className="rounded-full border border-gray-200 bg-stone-100 font-semibold transition focus-within:!border-green-600/40 focus-within:outline-4 focus-within:outline-green-400/10">
      <div className="inline-flex">
        <button
          className="aspect-square h-12 rounded-full active:bg-black/5"
          type="button"
          onClick={() => {
            ref.current?.stepDown();
          }}
        >
          -
        </button>
        <input
          defaultValue={defaultValue ?? 1}
          type="number"
          name={name}
          min={0}
          step={0.5}
          ref={ref}
          className="min-w-[10ch] max-w-[12ch] border-none bg-transparent focus:ring-0"
        />
        <button
          className="aspect-square h-12 rounded-full active:bg-black/5"
          type="button"
          onClick={() => {
            ref.current?.stepUp();
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

export { ServingsInput };
