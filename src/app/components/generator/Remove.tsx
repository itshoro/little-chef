"use client";

import { useGeneratorContext } from "./Context";

type RemoveProps = {
  children: React.ReactNode;
  uid: string;
  className: string;
};

const Remove = ({ children, className, uid }: RemoveProps) => {
  const { removeItem, removeDisabled } = useGeneratorContext(Remove.name);
  return (
    <button
      disabled={removeDisabled}
      type="button"
      className={className}
      onClick={() => removeItem(uid)}
    >
      {children}
    </button>
  );
};

export { Remove };
