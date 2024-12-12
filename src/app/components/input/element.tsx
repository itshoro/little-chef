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
      className={`rounded-lg border border-stone-200 bg-stone-100 p-2 ring-0 ring-black/20 outline-hidden transition ring-inset hover:border-transparent hover:bg-white hover:ring-2 hover:ring-lime-500/60 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-lime-500/60 dark:border-stone-800 dark:bg-stone-900 dark:hover:bg-black dark:focus:bg-black ${props.className}`}
      data-slot="control"
      ref={ref}
      name={_name}
      id={_id}
    />
  );
});

export { Element };
