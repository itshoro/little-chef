"use client";

import { useFieldContext } from "./field-root";

interface LabelProps extends React.ComponentProps<"label"> {}

const Label = ({ children, className = "", ...props }: LabelProps) => {
  const { id } = useFieldContext(Label.name);

  return (
    <label
      htmlFor={id}
      className={`mb-2 block text-sm font-medium text-white ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

export { Label };
