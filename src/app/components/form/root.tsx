"use client";

import { useContext } from "@/hooks/useContext";
import { createContext, useRef } from "react";
import { useFormState } from "react-dom";

type FormContext =
  | {
      success: false;
      error?: string | string[];
    }
  | {
      success: true;
    };

const FormErrorContext = createContext<FormContext | null>(null);
const useFormErrorContext = (calleeName: string) =>
  useContext(calleeName, FormErrorContext);

type FormProps = {
  action: (
    previousState: FormContext,
    formData: FormData,
  ) => FormContext | Promise<FormContext>;
  children: React.ReactNode;
  initialState?: FormContext;
};

const Form = ({
  action,
  children,
  initialState = { success: false },
}: FormProps) => {
  const ref = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(action, initialState);

  if (state.success) {
    ref.current?.reset();
  }

  return (
    <FormErrorContext.Provider value={state}>
      <form ref={ref} action={formAction}>
        {children}
      </form>
    </FormErrorContext.Provider>
  );
};

export { Form, useFormErrorContext, type FormContext };
