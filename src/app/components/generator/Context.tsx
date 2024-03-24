"use client";

import { createContext, useContext } from "react";

type GeneratorContextProps = {
  uids: readonly string[];
  addItem: () => void;
  removeItem: (key: string) => void;
  removeDisabled: boolean;
};

const GeneratorContext = createContext<GeneratorContextProps | null>(null);

function useGeneratorContext(componentName: string) {
  const context = useContext(GeneratorContext);
  if (context === null)
    throw new Error(
      `${componentName} must have a GeneratorContext.Provider parent.`,
    );

  return context;
}

export { GeneratorContext, type GeneratorContextProps, useGeneratorContext };
