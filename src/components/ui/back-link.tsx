"use client";

import { useRouter } from "next/navigation";

const BackLink = () => {
  const router = useRouter();
  return (
    <button type="button" onClick={() => router.back()}>
      <div className="rounded-lg p-1 ring-1 ring-black/5 dark:bg-stone-800">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </div>
    </button>
  );
};

export { BackLink };
