"use client";

import { useSearchParamState } from "@/hooks/useSearchParamState";
import { toNumber } from "./lib";
import { useRouter } from "next/navigation";
import { Prisma } from "@prisma/client";

const Actions = ({
  step,
  recipe,
}: {
  step: number;
  recipe: Prisma.RecipeGetPayload<{ include: { RecipeStep: true } }>;
}) => {
  const router = useRouter();

  function next() {
    debugger;
    if (step < recipe.RecipeStep.length) {
      router.replace(`/recipes/${recipe.publicId}/overview/wizard/${step + 1}`);
    }
  }

  function previous() {
    if (step === 0) {
      router.replace(`/recipes/${recipe.publicId}/overview`);
      return;
    } else if (step > 0) {
      router.replace(`/recipes/${recipe.publicId}/overview/wizard/${step - 1}`);
    }
  }

  return (
    <>
      <button
        className="inline-flex select-none items-center rounded-full border bg-stone-50 px-3 py-2 font-medium text-stone-800 transition ease-out hover:shadow-inner disabled:pointer-events-none disabled:text-gray-400"
        onClick={previous}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <button
        className="inline-flex select-none items-center rounded-full border bg-stone-50 px-3 py-2 font-medium text-stone-800 transition ease-out hover:shadow-inner disabled:pointer-events-none disabled:text-gray-400"
        disabled={step + 1 >= recipe.RecipeStep.length}
        onClick={next}
      >
        <div className="inline-flex items-center gap-6">
          Next
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>
    </>
  );
};

export { Actions };
