"use client";

import { useGeneratorContext } from "./context";

type ItemsProps = {
  children: (
    value: string,
    index: number,
    array: readonly string[],
  ) => React.ReactNode;
};

const Items = ({ children }: ItemsProps) => {
  const { ids } = useGeneratorContext(Items.name);

  return <>{ids.map(children)}</>;
};

export { Items };
