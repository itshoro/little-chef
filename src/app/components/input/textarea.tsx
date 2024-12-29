"use client";

import { forwardRef } from "react";
import { useFormStateContext } from "../form/root";
import { useInputContext } from "./context";

type TextareaProps = React.ComponentPropsWithoutRef<"textarea">;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    const formStateContext = useFormStateContext(Textarea.name);
    const { name } = useInputContext(Textarea.name);
    const _name = props.name ? `${name}.${props.name}` : name;

    const submissionFailedDefaultValue = !formStateContext.success
      ? ((formStateContext.controls?.[
          name as keyof typeof formStateContext.controls
        ] as string) ?? null)
      : undefined;

    const defaultValue =
      submissionFailedDefaultValue !== undefined
        ? submissionFailedDefaultValue
        : props.defaultValue;

    const defaultChecked =
      submissionFailedDefaultValue !== undefined
        ? submissionFailedDefaultValue === props.value
        : props.defaultChecked;

    return (
      <textarea
        {...props}
        defaultChecked={defaultChecked}
        defaultValue={defaultValue}
        data-slot="control"
        ref={ref}
        name={_name}
        id={_name}
        className={`field-sizing-content rounded-lg bg-stone-100 p-2 ring-1 ring-stone-200 outline-hidden transition ring-inset focus-within:bg-white focus-within:ring-2 hover:ring-2 hover:ring-stone-300 focus:ring-2 focus:ring-lime-500/60 dark:bg-stone-900 dark:ring-stone-800 dark:focus-within:bg-stone-900 dark:focus-within:ring-lime-500/60 dark:hover:ring-stone-700 ${props.className}`}
      />
    );
  },
);

export { Textarea };
