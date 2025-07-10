"use client";

import type React from "react";
import { createContext, useContext } from "react";
import { useFieldContext } from "./field-root";

interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroupContext() {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error("Radio components must be used within a RadioGroup");
  }
  return context;
}

interface RadioGroupProps {
  value?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const RadioGroup = ({
  value,
  onChange,
  children,
  className = "",
}: RadioGroupProps) => {
  const { name } = useFieldContext(RadioGroup.name);

  return (
    <RadioGroupContext.Provider value={{ name, value, onChange }}>
      <div role="radiogroup" className={`space-y-2 ${className}`}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "name"> {
  value: string;
  children: React.ReactNode;
}

const Radio = ({ value, children, className = "", ...props }: RadioProps) => {
  const { name, value: groupValue, onChange } = useRadioGroupContext();
  const isChecked = groupValue === value;

  return (
    <label
      className={`flex cursor-pointer items-center space-x-3 ${className}`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={isChecked}
        onChange={(e) => onChange?.(e.target.value)}
        className={`relative h-4 w-4 appearance-none rounded-full border border-white/5 bg-stone-800 transition-all duration-200 before:absolute before:top-1/2 before:left-1/2 before:h-2 before:w-2 before:-translate-x-1/2 before:-translate-y-1/2 before:transform before:rounded-full before:bg-lime-300 before:opacity-0 before:transition-opacity before:content-[''] checked:border-lime-300 checked:bg-lime-900/30 checked:ring-1 checked:ring-lime-300 checked:before:opacity-100 focus:ring-2 focus:ring-lime-300 focus:ring-offset-2 focus:ring-offset-stone-900 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50`}
        {...props}
      />
      <span className="text-sm text-white">{children}</span>
    </label>
  );
};

export { Radio, RadioGroup, type RadioGroupProps, type RadioProps };
