"use client";

import { useFormStateContext } from "../form/root";
import { useInputContext } from "./context";

const Element = (props: React.ComponentProps<"input">) => {
  const inputContext = useInputContext(Element.name);
  const formStateContext = useFormStateContext(Element.name);

  const name = props.name
    ? `${inputContext.name}.${props.name}`
    : inputContext.name;
  const id = props.id ? `${name}.${props.id}` : inputContext.name;
  const defaultValue =
    ((!formStateContext.success &&
      formStateContext.controls?.[
        name as keyof typeof formStateContext.controls
      ]) as string) || props.defaultValue;

  const defaultChecked =
    ((!formStateContext.success &&
      formStateContext.controls?.[
        name as keyof typeof formStateContext.controls
      ]) as string) === props.value || props.defaultChecked;

  return (
    <input
      {...props}
      defaultChecked={defaultChecked}
      defaultValue={defaultValue}
      className={`rounded-lg bg-stone-100 p-2 ring-1 ring-stone-200 outline-hidden transition ring-inset group-[:has([data-slot=error])]:!ring-red-500 focus-within:bg-white focus-within:ring-2 hover:ring-2 hover:ring-stone-300 focus:ring-2 focus:ring-lime-500/60 dark:bg-stone-900 dark:ring-stone-800 dark:focus-within:bg-stone-900 dark:focus-within:ring-lime-500/60 dark:hover:ring-stone-700 ${props.className}`}
      data-slot="control"
      name={name}
      id={id}
      aria-describedby={`${id}-error`}
    />
  );
};

export { Element };
