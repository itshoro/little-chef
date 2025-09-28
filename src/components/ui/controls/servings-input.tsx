"use client";

import { useCallback, useRef } from "react";
import { Button } from "../buttons/button";
import { Input } from "./input";
import { Label } from "./label";

interface ServingsInputProps extends React.ComponentProps<"input"> {}

const ServingsInput = (props: ServingsInputProps) => {
  const internalRef = useRef<HTMLInputElement>(null);

  const setRefs = useCallback(
    (node: HTMLInputElement | null) => {
      internalRef.current = node;
      if (typeof props.ref === "function") {
        props.ref(node);
      } else if (props.ref) {
        props.ref.current = node;
      }
    },
    [props.ref],
  );

  const handleStepChange = useCallback((action: "stepUp" | "stepDown") => {
    if (internalRef.current) {
      internalRef.current[action]();

      // stepDown and stepUp don't trigger onChange automatically.
      const event = new Event("input", { bubbles: true });
      internalRef.current.dispatchEvent(event);
    }
  }, []);

  return (
    <div className="flex items-baseline gap-2">
      {/* <div data-slot="icon" className="flex items-center gap-2">
        <span>
          <Button
            variant="outline"
            className="size-12"
            type="button"
            onClick={() => handleStepChange("stepDown")}
            tabIndex={-1}
          >
            <span className="transform">-</span>
          </Button>
        </span>
      </div> */}
      <Input
        {...props}
        ref={setRefs}
        type="number"
        className="w-full max-w-[8ch] min-w-[6ch] rounded-xl"
      />

      {/* <span data-slot="icon">
        <Button
          variant="outline"
          className="size-12"
          type="button"
          onClick={() => handleStepChange("stepUp")}
          tabIndex={-1}
        >
          <span className="transform">+</span>
        </Button>
      </span> */}
    </div>
  );
};

export { ServingsInput };
