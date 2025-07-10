"use client";

import { useFieldContext } from "./field-root";

interface RadioCardsProps {
  value?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

export function RadioCards({
  children,
  className = "",
  columns = 2,
}: RadioCardsProps) {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      role="radiogroup"
      className={`grid gap-3 ${gridClasses[columns]} ${className}`}
    >
      {children}
    </div>
  );
}

interface RadioCardProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "name"> {
  value: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  image?: string;
  description?: string;
  badge?: string;
}

export function RadioCard({
  value,
  children,
  icon,
  image,
  description,
  badge,
  className = "",
  ...props
}: RadioCardProps) {
  const { name } = useFieldContext(RadioCard.name);

  const id = `${name}-${value}`;

  return (
    <div>
      <input
        type="radio"
        name={name}
        value={value}
        id={id}
        className="peer checked:text-bg-300 absolute top-2 right-2 appearance-none rounded-full border-0 !bg-transparent before:absolute before:inset-1 before:rounded-full checked:ring-2 checked:ring-lime-300 checked:outline-none checked:before:bg-lime-300"
        {...props}
      />

      <label
        htmlFor={id}
        className={`relative flex cursor-pointer flex-col rounded-lg border border-white/5 bg-stone-800 p-4 transition-all duration-200 peer-checked:border-lime-300/50 peer-checked:bg-lime-900/20 peer-checked:ring-1 peer-checked:ring-lime-300 focus-within:ring-2 focus-within:ring-lime-300 focus-within:ring-offset-2 focus-within:ring-offset-stone-900 hover:border-white/10 hover:bg-stone-700/50 ${className}`}
      >
        <div className="flex items-start gap-3">
          {icon && (
            <div className="flex-shrink-0">
              <div className="h-6 w-6 text-white/70">{icon}</div>
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="mb-1 text-sm font-medium text-white">
              {children}
            </div>
            {description && (
              <div className="text-xs leading-relaxed text-pretty text-white/60">
                {description}
              </div>
            )}
          </div>
        </div>

        {/* Selection Indicator */}
        <div className="absolute top-3 right-3">
          <div
            className={`relative h-4 w-4 rounded-full border border-white/20 transition-all duration-200 peer-checked:border-lime-600 peer-checked:bg-lime-600 before:absolute before:top-1/2 before:left-1/2 before:h-2 before:w-2 before:-translate-x-1/2 before:-translate-y-1/2 before:transform before:rounded-full before:bg-white before:opacity-0 before:transition-opacity before:content-[''] before:peer-checked:opacity-100`}
          />
        </div>
      </label>
    </div>
  );
}
