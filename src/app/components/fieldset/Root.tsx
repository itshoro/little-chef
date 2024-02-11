"use client";

import { useContext } from "react";
import { InputContext } from "../input/Context";

type RootProps = {
  children: React.ReactNode;
  name?: string;
};

const Root: React.FC<RootProps> = ({ children, name }) => {
  const parentContext = useContext(InputContext);

  if (typeof parentContext?.name === "string")
    name = `${parentContext.name}.${name}`;

  return (
    <fieldset data-parent="true" className="group">
      <InputContext.Provider value={{ name }}>{children}</InputContext.Provider>
    </fieldset>
  );
};

export { Root };
