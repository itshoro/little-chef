"use client";

import { useSearchParamState } from "@/hooks/useSearchParamState";
import { useRef } from "react";

type Props = {
  urlParam?: string;
};

const Input = ({ urlParam = "q" }: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [query, setQuery] = useSearchParamState(urlParam);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    setQuery(formData.get("search") as string);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      e.preventDefault();

      if ((e.target as HTMLInputElement).value.length > 0) {
        (e.target as HTMLInputElement).value = "";
      } else {
        (e.target as HTMLInputElement).blur();
      }
    }
  }

  function onInput() {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      formRef.current?.requestSubmit();
    }, 100);
  }

  function onBlur() {
    clearTimeout(timeoutRef.current);
    formRef.current?.requestSubmit();
  }

  return (
    <form ref={formRef} onSubmit={onSubmit}>
      <label className="group block cursor-text rounded-xl bg-stone-100 p-4 text-stone-700">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5 text-stone-500 transition-colors group-focus-within:text-emerald-800 group-hover:text-emerald-800"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
          <input
            name="search"
            defaultValue={query ?? ""}
            onKeyDown={onKeyDown}
            onInput={onInput}
            onBlur={onBlur}
            placeholder="Search&#8230;"
            type="text"
            className="w-full border-none bg-transparent pl-3 font-medium capitalize outline-none"
            autoComplete="off"
          />
        </div>
      </label>
    </form>
  );
};

export { Input as SearchInput };
