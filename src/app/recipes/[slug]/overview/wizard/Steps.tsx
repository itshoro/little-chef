import { Prisma } from "@prisma/client";

const WizardSteps = ({
  step,
}: {
  step: Prisma.RecipeGetPayload<{
    include: { RecipeStep: { include: { Step: true } } };
  }>["RecipeStep"][number];
}) => {
  return (
    <div className="my-auto p-4">
      <div className="w-full text-xl">
        <ul className="w-full space-y-2">
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
        className="mx-auto text-balance rounded-2xl bg-white px-3 py-2 text-center shadow-sm aria-[current=false]:scale-90 aria-[current=false]:opacity-60"
        aria-current={current}
      >
        {step}
      </div>
    </li>
  );
};

export { WizardSteps };
