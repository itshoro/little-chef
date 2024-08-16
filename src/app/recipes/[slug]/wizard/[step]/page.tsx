import { getRecipe, getRecipeSteps } from "@/lib/dal/recipe";
import { extractParts } from "@/lib/slug";
import { WizardStep } from "../step";
import { Actions } from "../actions";
import { validateRequest } from "@/lib/auth/lucia";

type PageProps = {
  params: {
    slug: string;
    step: string;
  };
  searchParams: {
    servings: string;
  };
};

const Page = async ({ params, searchParams }: PageProps) => {
  const { user } = await validateRequest();
  const { publicId } = extractParts(params.slug);

  const recipe = await getRecipe({ publicId }, user?.publicId);
  const steps = await getRecipeSteps(recipe.id);

  const step = Math.min(Number(params.step) || 0, steps.length);
  const displayedStep = steps[step];

  const ingredientScaleFactor =
    Number(searchParams.servings) / recipe.recommendedServingSize;

  return (
    <>
      <div className="mt-auto flex flex-col items-center justify-center px-4 py-8">
        <WizardStep
          description={displayedStep.description}
          ingredientScaleFactor={ingredientScaleFactor}
        />
        <div className="mt-4 text-sm">
          Step {step + 1} of {steps.length}
        </div>
      </div>
      <section
        className="flex justify-between border-t p-4 dark:border-stone-800"
        style={{ gridArea: "action", gridColumn: 1 }}
      >
        <Actions
          slug={recipe.slug}
          publicId={recipe.publicId}
          stepCount={steps.length}
          step={step}
          servings={searchParams.servings}
        />
      </section>
    </>
  );
};

export default Page;
