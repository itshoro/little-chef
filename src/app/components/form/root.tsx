"use client";

import { useContext } from "@/hooks/useContext";
import { createContext } from "react";
import { useFormState } from "react-dom";

type FormError = {
  error?: {
    message: string;
    target: string;
  };
};

const FormErrorContext = createContext<FormError | null>(null);
const useFormErrorContext = (calleeName: string) =>
  useContext(calleeName, FormErrorContext);

type FormProps = {
  action: (previousState: FormError, formData: FormData) => Awaited<FormError>;
  children: React.ReactNode;
  initialState?: FormError;
};

const Form = ({ action, children, initialState = {} }: FormProps) => {
  const [state, formAction] = useFormState(action, initialState);

  return (
    <FormErrorContext.Provider value={state}>
      <form action={formAction}>{children}</form>
    </FormErrorContext.Provider>
  );
};

export { Form, useFormErrorContext, type FormError };
