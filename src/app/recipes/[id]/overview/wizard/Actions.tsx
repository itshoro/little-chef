"use client";

import { useSearchParamState } from "@/hooks/useSearchParamState";
import { Recipe } from "@/lib/recipes/validators";
import { toNumber } from "./lib";
import { useRouter } from "next/navigation";

const Actions = ({ recipe }: { recipe: Recipe }) => {
  const router = useRouter();
  const [step, setStep] = useSearchParamState("step");

  function next() {
    setStep((step) => {
      const _step = toNumber(step);
      return String(_step < recipe.steps.length ? _step + 1 : _step);
    });
  }

  function previous() {
    debugger;
    if (step === null || step === "0") {
      router.push(`/recipes/${recipe.id}/overview`);
      return;
    }

    setStep((step) => {
      const _step = toNumber(step);
      return String(_step > 0 ? _step - 1 : _step);
    });
  }

  const _step = toNumber(step);
  if (_step > recipe.steps.length || _step < 0) {
    setStep("0");
  }

  return (
    <>
      <button
        className="rounded-full font-medium inline-flex items-center py-2 px-3 bg-stone-50 text-stone-800 border disabled:text-gray-400 disabled:pointer-events-none hover:shadow-inner transition ease-out select-none"
        onClick={previous}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <button
        className="rounded-full font-medium inline-flex items-center py-2 px-3 bg-stone-50 text-stone-800 border disabled:text-gray-400 disabled:pointer-events-none hover:shadow-inner transition ease-out select-none"
        disabled={_step + 1 >= recipe.steps.length}
        onClick={next}
      >
        <div className="inline-flex items-center gap-6">
          Next
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
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
