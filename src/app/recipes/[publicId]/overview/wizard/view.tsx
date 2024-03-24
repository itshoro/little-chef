import { Recipe } from "@/lib/recipes/actions/read";
import { Actions } from "./Actions";
import { WizardSteps } from "./Steps";

type WizardPageProps = {
  recipe: Recipe;
  step: number;
};

const WizardView = ({ recipe, step }: WizardPageProps) => {
  type SingleStep = Recipe["RecipeStep"][number];

  step = Math.min(Math.max(step, 0), recipe.RecipeStep.length);
  const displayedStep = recipe.RecipeStep.at(step) as SingleStep;

  return (
    <>
      <div className="flex items-center justify-center">
        <WizardSteps step={displayedStep} />
      </div>
      <section
        className="flex border-t p-4 justify-between"
        style={{ gridArea: "action", gridColumn: 1 }}
      >
        <Actions recipe={recipe} step={step} />
      </section>
    </>
  );
};

export default WizardView;
