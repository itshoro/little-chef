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
      className={`w-full rounded-md border border-white/10 bg-stone-800 px-3 py-2 text-white placeholder-white/50 transition-all duration-200 autofill:bg-stone-800 autofill:[-webkit-box-shadow:0_0_0_1000px_theme(colors.stone.800)_inset] autofill:[-webkit-text-fill-color:theme(colors.white)] autofill:hover:bg-stone-800 autofill:hover:[-webkit-box-shadow:0_0_0_1000px_theme(colors.stone.800)_inset] focus:border-lime-300/50 focus:bg-lime-900/30 focus:ring-2 focus:ring-lime-300 focus:outline-none autofill:focus:bg-stone-800 autofill:focus:[-webkit-box-shadow:0_0_0_1000px_theme(colors.stone.800)_inset] disabled:cursor-not-allowed disabled:opacity-50 data-[invalid]:border-red-500/50 data-[invalid]:focus:border-red-400/50 data-[invalid]:focus:bg-red-900/20 data-[invalid]:focus:ring-red-300 ${className} `}
      {...props}
    />
  );
};

export { Input, type InputProps };
