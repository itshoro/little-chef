"use client";

import { useInputContext } from "./context";

const Error = (props: React.ComponentProps<"div">) => {
  const { name } = useInputContext(Error.name);
  const target = props.id ? `${name}.${props.id}` : `${name}`;

  return (
    <div
      {...props}
      id={`${target}-error`}
      data-slot="error"
      className="text-sm text-red-500"
    />
  );
};

export { Error };
