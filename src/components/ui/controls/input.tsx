"use client";

import { useFieldContext } from "./field-root";

interface InputProps extends React.ComponentProps<"input"> {}

const Input = ({ className = "", ...props }: InputProps) => {
  const { name, id, describedBy, errorId } = useFieldContext(Input.name);

  return (
    <input
      id={id}
      name={name}
      aria-describedby={describedBy}
      aria-errormessage={errorId}
      className={`w-full rounded-md border border-stone-300 px-3 py-2 transition-all duration-200 focus:border-lime-300/50 focus:ring-2 focus:ring-lime-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-invalid:border-red-500/50 data-invalid:focus:border-red-400/50 data-invalid:focus:bg-red-900/20 data-invalid:focus:ring-red-300 dark:border-white/10 dark:bg-stone-800 dark:text-white dark:placeholder-white/50 dark:autofill:bg-stone-800 dark:autofill:[-webkit-box-shadow:0_0_0_1000px_var(--color-stone-800)_inset] dark:autofill:[-webkit-text-fill-color:var(--color-white)] dark:autofill:hover:bg-stone-800 dark:autofill:hover:[-webkit-box-shadow:0_0_0_1000px_var(--color-stone-800)_inset] dark:autofill:focus:bg-stone-800 dark:autofill:focus:[-webkit-box-shadow:0_0_0_1000px_var(--color-stone-800)_inset] ${className} `}
      {...props}
    />
  );
};

export { Input, type InputProps };
