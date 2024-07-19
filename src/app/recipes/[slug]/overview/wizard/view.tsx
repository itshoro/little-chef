import { Prisma } from "@prisma/client";
import { Actions } from "./Actions";
import { WizardSteps } from "./Steps";

type WizardPageProps = {
  recipe: Prisma.RecipeGetPayload<{
    include: { RecipeStep: { include: { Step: true } } };
  }>;
  step: number;
};

const WizardView = ({ recipe, step }: WizardPageProps) => {
  type SingleStep = (typeof recipe)["RecipeStep"][number];

  step = Math.min(Math.max(step, 0), recipe.RecipeStep.length);
  const displayedStep = recipe.RecipeStep.at(step) as SingleStep;

  return (
    <>
      <div className="flex items-center justify-center">
        <WizardSteps step={displayedStep} />
      </div>
      <section
        className="flex justify-between border-t p-4"
        style={{ gridArea: "action", gridColumn: 1 }}
      >
        <Actions recipe={recipe} step={step} />
      </section>
    </>
  );
};

export default WizardView;
