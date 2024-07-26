"use client";

import { useContext } from "react";
import { InputContext } from "../input/context";

type RootProps = {
  children: React.ReactNode;
  name?: string;
};

const Root: React.FC<RootProps> = ({ children, name }) => {
  const parentContext = useContext(InputContext);

  if (typeof parentContext?.name === "string")
    name = `${parentContext.name}.${name}`;

  return (
    <fieldset data-parent="true" className="group py-4">
      <InputContext.Provider value={{ name }}>{children}</InputContext.Provider>
    </fieldset>
  );
};

export { Root };
