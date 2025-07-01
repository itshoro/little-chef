"use client";

import { Parser } from "@cooklang/cooklang-ts";
import { Fragment, useRef } from "react";

const CooklangPreview = ({
  value,
  ingredientScaleFactor = 1,
}: {
  value?: string;
  ingredientScaleFactor?: number;
}) => {
  const parserRef = useRef<Parser>(undefined);
  if (parserRef.current === undefined) {
    parserRef.current = new Parser();
  }

  const parsedResult = value ? parserRef.current.parse(value).steps : [];

  if (parsedResult.length === 0) return null;

  return (
    <div>
      {parsedResult.map((step, i) => (
        <p key={i} className="leading-relaxed text-balance whitespace-normal">
          {step.map((segment, i) => {
            switch (segment.type) {
              case "text":
                return <Fragment key={i}>{segment.value}</Fragment>;
              case "ingredient":
                return (
                  <span
                    key={i}
                    className="my-0.5 inline-flex rounded-full border border-stone-300 px-2 whitespace-pre-line dark:border-stone-700"
                  >
                    <span className="border-r border-stone-300 p-1 dark:border-stone-700">
                      <span>
                        {typeof segment.quantity === "number"
                          ? segment.quantity * ingredientScaleFactor
                          : segment.quantity}{" "}
                      </span>
                      <span>{segment.units}</span>
                    </span>
                    <span className="p-1">{segment.name}</span>
                  </span>
                );
              case "cookware":
                return (
                  <Fragment key={i}>
                    {segment.quantity} {segment.name}
                  </Fragment>
                );
              case "timer":
                return (
                  <Fragment key={i}>
                    <time dateTime={`P${segment.quantity}`}>
                      {segment.quantity} {segment.units}
                    </time>
                  </Fragment>
                );
            }
          })}
        </p>
      ))}
    </div>
  );
};

export { CooklangPreview };
