"use client";

import { useContext } from "@/hooks/use-context";
import { createContext, useId } from "react";

interface FieldContextValue {
  name: string;
  id: string;
  describedBy?: string;
  errorId?: string;
}

const FieldContext = createContext<FieldContextValue | null>(null);
const useFieldContext = (callee: string) => useContext(callee, FieldContext);

interface FieldRootProps {
  name: string;
  children: React.ReactNode;
  className?: string;
}

const FieldRoot = ({ name, children, className }: FieldRootProps) => {
  const id = useId();
  const fieldId = `${name}-${id}`;
  const describedBy = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;

  return (
    <FieldContext.Provider value={{ name, id: fieldId, describedBy, errorId }}>
      <div className={className} data-field-root={name}>
        {children}
      </div>
    </FieldContext.Provider>
  );
};

export { FieldRoot, useFieldContext };
