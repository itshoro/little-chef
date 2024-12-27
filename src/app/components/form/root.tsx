"use client";

import { useContext } from "@/hooks/useContext";
import { createContext, useActionState, useEffect, useRef } from "react";

type Controls = Record<string, unknown>;
type FormState<TFormControls extends Controls | undefined = Controls> =
  | {
      success: false;
      message: string;
      errors?: { [K in keyof TFormControls]?: string[] };
      controls?: TFormControls;
    }
  | {
      success: true;
      message: string;
    };

const FormStateContext = createContext<FormState | null>(null);
const useFormStateContext = (calleeName: string) =>
  useContext(calleeName, FormStateContext);

type FormProps<TFormControls extends Controls> = {
  action: (
    previousState: FormState<TFormControls>,
    formData: FormData,
  ) => FormState<TFormControls> | Promise<FormState<TFormControls>>;
  children: React.ReactNode;
  initialState?: FormState<TFormControls>;
};

function useFocusFirstErroneousControl(state: FormState) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!formRef.current || state.success || !state.errors) return;

    // Select first erroneous control in form so that keyboard users tab through the form in order, when correcting issues.
    const erroneousControlNames = Object.keys(state.errors);
    for (const element of formRef.current.elements) {
      if (erroneousControlNames.includes((element as HTMLInputElement).name)) {
        // queuing a regular callback or microtask (or a combination of the two) wasn't sufficient to make certain that the alert area is announced before the control error.
        setTimeout(() => {
          (element as HTMLElement).focus();
        }, 0);
        return;
      }
    }
  }, [state]);

  return formRef;
}

const Form = <TFormControls extends Controls>({
  action,
  children,
  initialState = { success: false, message: "" },
}: FormProps<TFormControls>) => {
  const [state, formAction] = useActionState(action, initialState);
  const ref = useFocusFirstErroneousControl(state);

  return (
    <FormStateContext value={state}>
      <form ref={ref} action={formAction}>
        {children}
      </form>
    </FormStateContext>
  );
};

export {
  Form,
  useFormStateContext,
  type FormState,
  type Controls,
  type FormProps,
};
