"use client";

import { useGeneratorContext } from "./context";

const Add = ({ className, ...props }: React.ComponentProps<"button">) => {
  const { addItem } = useGeneratorContext(Add.name);
  return (
    <button
      type="button"
      className={`text-sm underline ${className}`}
      onClick={() => addItem()}
      {...props}
    />
  );
};

export { Add };
