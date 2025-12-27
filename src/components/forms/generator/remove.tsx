"use client";

import { useGeneratorContext } from "./context";

type RemoveProps<TKey> = {
  children: React.ReactNode;
  id: TKey;
  className: string;
};

const Remove = <TKey extends string | number>({
  children,
  className,
  id,
}: RemoveProps<TKey>) => {
  const { removeItem, removeDisabled } = useGeneratorContext<TKey>(Remove.name);
  return (
    <button
      disabled={removeDisabled}
      type="button"
      className={className}
      onClick={() => removeItem(id)}
    >
      {children}
    </button>
  );
};

export { Remove };
