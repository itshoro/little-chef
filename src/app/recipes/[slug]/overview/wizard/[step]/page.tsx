import { getRecipe, getRecipeSteps } from "@/lib/dal/recipe";
import { extractParts } from "@/lib/slug";
import { WizardSteps } from "../Steps";
import { Actions } from "../Actions";

type PageProps = {
  params: {
    slug: string;
    step: string;
  };
};

const Page = async ({ params }: PageProps) => {
  const { publicId } = extractParts(params.slug);

  const recipe = await getRecipe({ publicId });
  const steps = await getRecipeSteps(recipe.id);

  const step = Math.min(Number(params.step) || 0, steps.length);
  const displayedStep = steps[step];

  return (
    <>
      <div className="flex items-center justify-center">
        <WizardSteps description={displayedStep.description} />
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
        />
      </section>
    </>
  );
};

export default Page;
