"use client";

import { BaseButton } from "@/app/components/base-button";
import * as Input from "@/app/components/input";
import { passwordRange, usernameRange } from "@/lib/dal/user/types";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";

export type LoginFormData = {
  username?: string;
  password?: string;
};

export type LoginFormState = {
  success: boolean;
  message: string;
  errors?: { [K in keyof LoginFormData]?: string[] };
  data?: LoginFormData;
};

const initialState: LoginFormState = {
  success: false,
  message: "",
};

function useFocusFirstErroneousControl(state: LoginFormState) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!formRef.current || state.success || !state.errors) return;

    const erroneousControlNames = Object.keys(state.errors);

    // Select first erroneous control in form so that keyboard users tab through the form in order, when correcting issues.
    for (const element of formRef.current.elements) {
      if (erroneousControlNames.includes((element as HTMLInputElement).name)) {
        (element as HTMLElement).focus();
        return;
      }
    }
  }, [state]);

  return formRef;
}

const LoginForm = ({
  action,
}: {
  action: (
    state: LoginFormState,
    formData: FormData,
  ) => Promise<LoginFormState>;
}) => {
  const [state, _action, isPending] = useActionState(action, initialState);
  const formRef = useFocusFirstErroneousControl(state);

  return (
    <form ref={formRef} action={_action}>
      <div>
        <Input.Root name="username">
          <Input.Label className="pb-2">Username</Input.Label>
          <Input.Group>
            <Input.Element
              type="text"
              minLength={usernameRange.min}
              maxLength={usernameRange.max}
              aria-describedby="username-error"
              defaultValue={state.data?.username}
            />
          </Input.Group>
          {state.errors?.username && (
            <Input.Error>{state.errors.username[0]}</Input.Error>
          )}
        </Input.Root>
      </div>
      <div className="mt-2 mb-6">
        <Input.Root name="password">
          <Input.Label className="pb-2">Password</Input.Label>
          <Input.Group>
            <Input.Element
              type="password"
              minLength={passwordRange.min}
              maxLength={passwordRange.max}
              className={state.errors?.password ? "ring-red-500" : undefined}
              aria-describedby="password-error"
            />
          </Input.Group>
          {state.errors?.password && (
            <Input.Error>{state.errors.password[0]}</Input.Error>
          )}
        </Input.Root>
      </div>

      {!state.success && <div aria-live="polite">{state.message}</div>}

      <div className="flex items-baseline justify-between">
        <Link className="text-lime-300 underline" href="/sign-up">
          Create an account
        </Link>
        <BaseButton disabled={isPending} type="submit">
          Continue
        </BaseButton>
      </div>
    </form>
  );
};

export { LoginForm };
