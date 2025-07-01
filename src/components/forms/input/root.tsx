"use client";

import { useContext } from "react";
import { InputContext } from "./context";

type RootProps = {
  children: React.ReactNode;
  name?: string;
};

const Root = ({ children, name }: RootProps) => {
  const parentContext = useContext(InputContext);

  if (typeof parentContext?.name === "string")
    name = `${parentContext.name}.${name}`;

  return (
    <InputContext.Provider value={{ name }}>{children}</InputContext.Provider>
  );
};

export { Root };
