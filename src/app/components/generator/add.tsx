"use client";

import { useGeneratorContext } from "./context";

type AddProps = {
  children: React.ReactNode;
};

const Add = ({ children }: AddProps) => {
  const { addItem } = useGeneratorContext(Add.name);
  return (
    <button
      type="button"
      className="ml-auto flex items-center rounded-xl p-2 text-stone-600 transition-all hover:bg-stone-100 disabled:hover:bg-none"
      onClick={() => addItem()}
    >
      {children}
    </button>
  );
};

export { Add };
