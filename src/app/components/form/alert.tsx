"use client";
import { useFormStateContext } from "./root";

const Alert = () => {
  const formState = useFormStateContext(Alert.name);

  const errorCount = formState.success
    ? 0
    : Object.keys(formState.errors ?? {}).length;

  return (
    <div role="alert">
      {formState.message && (
        <div className="-mx-2 mb-4 flex gap-2 rounded-lg bg-red-100 p-4 text-pretty text-rose-700">
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
          <div>{formState.message}</div>
          {errorCount > 0 && <div>{errorCount} error(s) are present.</div>}
        </div>
      )}
    </div>
  );
};

export { Alert };
