"use client";

import { useFormStateContext } from "../form/root";
import { useInputContext } from "./context";

const InlineError = (props: React.ComponentPropsWithoutRef<"div">) => {
  const { name } = useInputContext(InlineError.name);
  const target = props.id ? `${name}.${props.id}` : `${name}`;

  const formState = useFormStateContext(target);
  const message =
    !formState.success &&
    formState.errors?.[target as keyof typeof formState.errors]?.[0];

  if (!message) return null;

  return (
    <div
      {...props}
      id={`${target}-error`}
      data-slot="error"
      className="text-sm text-red-500"
    >
      {message}
    </div>
  );
};

export { InlineError };
