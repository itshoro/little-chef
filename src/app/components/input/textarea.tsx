"use client";

import { forwardRef } from "react";
import { useInputContext } from "./context";

type TextareaProps = React.ComponentPropsWithoutRef<"textarea">;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    const { name } = useInputContext(Textarea.name);
    const _name = props.name ? `${name}.${props.name}` : name;

    return (
      <textarea
        ref={ref}
        {...props}
        className="m-0.5 min-h-[3lh] w-full rounded-lg border-none bg-transparent p-1.5 font-medium outline-none transition focus:ring-transparent"
        name={_name}
        id={_name}
      />
    );
  },
);

export { Textarea };
