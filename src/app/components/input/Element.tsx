"use client";

import { useInputContext } from "./Context";

const Element = (
  props: Omit<React.ComponentPropsWithoutRef<"input">, "className">
) => {
  const { name } = useInputContext(Element.name);
  const _name = props.name ? `${name}.${props.name}` : name;

  return (
    <input
      name={_name}
      id={_name}
      className="p-2 rounded-lg w-full bg-transparent"
      {...props}
    />
  );
};

export { Element };
