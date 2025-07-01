"use client";

import { useGeneratorContext } from "./context";

const Add = ({
  className,
  after,
  ...props
}: React.ComponentProps<"button"> & { after?: number }) => {
  const { addItem } = useGeneratorContext(Add.name);
  return (
    <button
      type="button"
      className={`text-sm underline ${className}`}
      onClick={() => addItem(after)}
      {...props}
    />
  );
};

export { Add };
