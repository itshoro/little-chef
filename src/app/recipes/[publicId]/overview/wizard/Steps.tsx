import type { Recipe } from "@/lib/recipes/actions/read";

const WizardSteps = ({ step }: { step: Recipe["RecipeStep"][number] }) => {
  return (
    <div className="my-auto p-4">
      <div className="text-xl w-full">
        <ul className="space-y-2 w-full">
          <WizardStep
            current={true}
            // current={i === 0}
            // key={i}
            step={step.Step.description}
          />
        </ul>
      </div>
    </div>
  );
};

const WizardStep = ({ step, current }: { step: string; current: boolean }) => {
  return (
    <li>
      <div
        className="text-center text-balance mx-auto aria-[current=false]:opacity-60 aria-[current=false]:scale-90 bg-white shadow-sm px-3 py-2 rounded-2xl"
        aria-current={current}
      >
        {step}
      </div>
    </li>
  );
};

export { WizardSteps };
