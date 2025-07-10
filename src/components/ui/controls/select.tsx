"use client";

import { useFieldContext } from "./field-root";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = ({ children, className = "", ...props }: SelectProps) => {
  const { name, id, describedBy, errorId } = useFieldContext(Select.name);

  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        aria-describedby={describedBy}
        aria-errormessage={errorId}
        className={`w-full cursor-pointer appearance-none rounded-md border border-white/5 bg-stone-800 px-3 py-2 pr-10 text-white transition-all duration-200 focus:border-lime-300/50 focus:bg-lime-900/30 focus:ring-2 focus:ring-lime-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[invalid]:border-red-500/50 data-[invalid]:focus:border-red-400/50 data-[invalid]:focus:bg-red-900/20 data-[invalid]:focus:ring-red-300 ${className} `}
        {...props}
      >
        {children}
      </select>
      {/* <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-white/50" /> */}
    </div>
  );
};

interface OptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {}

const Option = ({ children, ...props }: OptionProps) => {
  return (
    <option className="bg-stone-800 text-white" {...props}>
      {children}
    </option>
  );
};

export { Option, Select, type OptionProps, type SelectProps };
