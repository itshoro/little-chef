"use client";

import { Parser } from "@cooklang/cooklang-ts";
import { useRef } from "react";

const CooklangPreview = ({
  value,
  ingredientScaleFactor = 1,
}: {
  value?: string;
  ingredientScaleFactor?: number;
}) => {
  const parserRef = useRef<Parser>();
  if (parserRef.current === undefined) {
    parserRef.current = new Parser();
  }

  const parsedResult = value ? parserRef.current.parse(value).steps : [];

  if (parsedResult.length === 0) return null;

  return (
    <div>
      {parsedResult.map((step, i) => (
        <p key={i}>
          {step.map((segment, i) => {
            switch (segment.type) {
              case "text":
                return <span key={i}>{segment.value}</span>;
              case "ingredient":
                return (
                  <span
                    key={i}
                    className="inline-flex rounded-full bg-neutral-100 px-2 dark:bg-stone-900"
                  >
                    <span className="border-r px-2 py-2 dark:border-stone-700">
                      {typeof segment.quantity === "number"
                        ? segment.quantity * ingredientScaleFactor
                        : segment.quantity}
                      {segment.units}
                    </span>
                    <span className="px-2 py-2">{segment.name}</span>
                  </span>
                );
              case "cookware":
                return (
                  <span key={i}>
                    {segment.quantity} {segment.name}
                  </span>
                );
              case "timer":
                return (
                  <span key={i}>
                    <time dateTime={`P${segment.quantity}`}>
                      {segment.quantity} {segment.units}
                    </time>
                  </span>
                );
            }
          })}
        </p>
      ))}
    </div>
  );
};

export { CooklangPreview };
