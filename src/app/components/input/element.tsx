"use client";

import { forwardRef } from "react";
import { useInputContext } from "./context";

const Element = forwardRef<
  React.ComponentRef<"input">,
  React.ComponentPropsWithoutRef<"input">
>((props, ref) => {
  const { name } = useInputContext(Element.name);
  const _name = props.name ? `${name}.${props.name}` : name;
  const _id = props.id ? `${name}.${props.id}` : _name;

  return (
    <input
      {...props}
      className={`rounded-lg bg-stone-100 p-2 ring-1 ring-stone-200 outline-hidden transition ring-inset group-[:has([data-slot=error])]:!ring-red-500 focus-within:bg-white focus-within:ring-2 hover:ring-2 hover:ring-stone-300 focus:ring-2 focus:ring-lime-500/60 dark:bg-stone-900 dark:ring-stone-800 dark:focus-within:bg-stone-900 dark:focus-within:ring-lime-500/60 dark:hover:ring-stone-700 ${props.className}`}
      data-slot="control"
      ref={ref}
      name={_name}
      id={_id}
      aria-describedby={`${_id}-error`}
    />
  );
});

export { Element };
