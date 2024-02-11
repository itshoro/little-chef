"use client";

// import { Recipe } from "@/lib/recipes/validators";
import { useSearchParams } from "next/navigation";
import { toNumber } from "./lib";
import type { Recipe } from "@/lib/recipes/actions/read";

const WizardSteps = ({ steps }: { steps: Recipe["RecipeStep"] }) => {
  const params = useSearchParams();

  const stepNumber = toNumber(params.get("step"));
  const relevantSteps = steps.slice(0, stepNumber + 1);

  return (
    <ul className="p-4 space-y-2 mt-auto">
      {relevantSteps.map((step, i) => (
        <WizardStep
          current={i === stepNumber}
          key={i}
          step={step.Step.description}
        />
      ))}
    </ul>
  );
};

const WizardStep = ({ step, current }: { step: string; current: boolean }) => {
  return (
    <li>
      <div
        className="aria-[current=false]:opacity-60 aria-[current=false]:scale-90 bg-stone-200 px-3 py-2 rounded-2xl transition ease-out origin-left"
        aria-current={current}
      >
        {step}
      </div>
    </li>
  );
};

export { WizardSteps };
