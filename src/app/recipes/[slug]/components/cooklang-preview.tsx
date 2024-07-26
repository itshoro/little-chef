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
  const previewData = parsedResult.pop();

  return (
    <div>
      {previewData?.map((segment) => {
        switch (segment.type) {
          case "text":
            return <span>{segment.value}</span>;
          case "ingredient":
            return (
              <span className="inline-flex divide-x rounded-full bg-neutral-100 px-2">
                <span className="px-2 py-2">
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
  );
};

export { CooklangPreview };
