"use client";

import { useFormState } from "react-dom";

type FormProps<TState> = React.ComponentPropsWithoutRef<"form"> & {
  action: (state: Awaited<TState>) => TState | Promise<TState>;
};

const initialState = {
  error: "",
  success: undefined,
};

const Form = ({
  action,
  children,
  ...props
}: FormProps<typeof initialState>) => {
  console.log(action.name);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} {...props}>
      <div aria-live="polite">{state.error}</div>

      {children}
    </form>
  );
};

export { Form, type FormProps };
