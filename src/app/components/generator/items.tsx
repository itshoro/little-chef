"use client";

import { useGeneratorContext } from "./Context";

type ItemsProps = {
  children: (
    value: string,
    index: number,
    array: readonly string[],
  ) => React.ReactNode;
};

const Items = ({ children }: ItemsProps) => {
  const { uids } = useGeneratorContext(Items.name);

  return <>{uids.map(children)}</>;
};

export { Items };
