"use client";

import { useInputContext } from "./context";

const Error = (props: React.ComponentPropsWithoutRef<"div">) => {
  const { name } = useInputContext(Element.name);
  const id = props.id ? `${name}.${props.id}-error` : `${name}-error`;

  return (
    <div
      {...props}
      id={id}
      data-slot="error"
      className="text-sm text-red-500"
    />
  );
};

export { Error };
