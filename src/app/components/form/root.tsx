"use client";

import { useContext } from "@/hooks/useContext";
import { createContext, useRef, useActionState, useTransition } from "react";

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
  retainFormDataOnFailure?: boolean;
};

const Form = ({
  action,
  children,
  retainFormDataOnFailure,
  initialState = { success: false },
}: FormProps) => {
  const ref = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(action, initialState);
  const [_, startTransition] = useTransition();

  if (state.success) {
    ref.current?.reset();
  }

  return (
    <FormErrorContext.Provider value={state}>
      <form
        ref={ref}
        action={formAction}
        onSubmit={(e) => {
          if (retainFormDataOnFailure) {
            e.preventDefault();

            startTransition(() => formAction(new FormData(e.currentTarget)));
          }
        }}
      >
        {children}
      </form>
    </FormErrorContext.Provider>
  );
};

export { Form, useFormErrorContext, type FormContext };
