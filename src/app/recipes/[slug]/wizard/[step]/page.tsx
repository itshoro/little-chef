import { getRecipe, getRecipeSteps } from "@/lib/dal/recipe";
import { extractParts } from "@/lib/slug";
import { WizardSteps } from "../Steps";
import { Actions } from "../actions";

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
  const { publicId } = extractParts(params.slug);

  const recipe = await getRecipe({ publicId });
  const steps = await getRecipeSteps(recipe.id);

  const step = Math.min(Number(params.step) || 0, steps.length);
  const displayedStep = steps[step];

  const ingredientScaleFactor =
    Number(searchParams.servings) / recipe.recommendedServingSize;

  return (
    <>
      <div className="flex items-center justify-center">
        <WizardSteps
          description={displayedStep.description}
          ingredientScaleFactor={ingredientScaleFactor}
        />
      </div>
      <section
        className="flex justify-between border-t p-4"
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
