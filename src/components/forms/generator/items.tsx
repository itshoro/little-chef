"use client";

import { useGeneratorContext } from "./context";

type ItemsProps<T> = {
  children: (value: T, index: number, array: readonly T[]) => React.ReactNode;
};

const Items = <T extends string | number>({ children }: ItemsProps<T>) => {
  const { ids } = useGeneratorContext<T>(Items.name);

  return <>{ids.map(children)}</>;
};

export { Items };
