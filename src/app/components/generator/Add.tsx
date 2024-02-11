"use client";

import { useGeneratorContext } from "./Context";

type AddProps = {
  children: React.ReactNode;
};

const Add = ({ children }: AddProps) => {
  const { addItem } = useGeneratorContext(Add.name);
  return (
    <button
      type="button"
      className="flex items-center ml-auto disabled:hover:bg-none text-stone-600 hover:bg-stone-100 p-2 transition-all rounded-xl"
      onClick={() => addItem()}
    >
      {children}
    </button>
  );
};

export { Add };
