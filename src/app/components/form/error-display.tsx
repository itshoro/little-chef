"use client";
import { useFormErrorContext } from "./root";

const FormErrorDisplay = () => {
  const { error } = useFormErrorContext(FormErrorDisplay.name);

  if (!error) return null;

  return (
    <div
      aria-live="polite"
      className="-mx-2 mb-4 flex gap-2 text-pretty rounded-lg bg-red-100 p-4 text-rose-700"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 shrink-0"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
        />
      </svg>
      {error.message}
    </div>
  );
};

export { FormErrorDisplay };
