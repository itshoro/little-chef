"use client";

import { useContext } from "@/hooks/use-context";
import { createContext } from "react";

type InputContextProps = {
  name?: string;
};

const InputContext = createContext<InputContextProps | null>(null);

const useInputContext = (calleeName: string) =>
  useContext(calleeName, InputContext);

export { useInputContext, InputContext };
