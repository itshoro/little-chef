"use client";

import { useSearchParamState } from "@/hooks/useSearchParamState";
import { useRef } from "react";

type Props = {
  urlParam?: string;
};

const Input = ({ urlParam = "q" }: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [query, setQuery] = useSearchParamState(urlParam);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const search = form.search as HTMLInputElement;

    setQuery(search.value);
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

  return (
    <form ref={formRef} onSubmit={onSubmit}>
      <label className="group block rounded-2xl bg-none text-gray-700 cursor-text">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 text-stone-500 group-hover:text-emerald-800 group-focus-within:text-emerald-800 transition-colors"
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
            placeholder="Search&#8230;"
            type="text"
            className="w-full p-2 bg-transparent outline-none capitalize font-medium"
            autoComplete="off"
          />
        </div>
      </label>
    </form>
  );
};

export { Input as SearchInput };
