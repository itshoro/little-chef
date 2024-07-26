"use client";

import { forwardRef } from "react";
import { useInputContext } from "./context";

const Element = forwardRef<
  React.ElementRef<"input">,
  Omit<React.ComponentPropsWithoutRef<"input">, "className">
>((props, ref) => {
  const { name } = useInputContext(Element.name);
  const _name = props.name ? `${name}.${props.name}` : name;

  return (
    <input
      {...props}
      ref={ref}
      name={_name}
      id={_name}
      className="w-full rounded-lg border-none bg-transparent p-2 outline-none focus:ring-transparent"
    />
  );
});

export { Element };
