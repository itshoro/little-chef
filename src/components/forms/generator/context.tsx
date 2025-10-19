"use client";

import { createContext, useContext } from "react";

type GeneratorContextProps<TKey extends string | number> = {
  ids: readonly TKey[];
  addItem: (after?: number) => void;
  removeItem: (id: TKey) => void;
  removeDisabled: boolean;
};

const GeneratorContext = createContext<GeneratorContextProps<any> | null>(null);

function useGeneratorContext<TKey extends string | number>(
  componentName: string,
) {
  const context = useContext(GeneratorContext);
  if (context === null)
    throw new Error(
      `${componentName} must have a GeneratorContext.Provider parent.`,
    );

  return context as unknown as GeneratorContextProps<TKey>;
}

export { GeneratorContext, type GeneratorContextProps, useGeneratorContext };
