import { ForceWakeLock } from "@/app/components/wake-lock/force-wakelock";
import { validateRequest } from "@/lib/auth";
import { getRecipe, getRecipeSteps } from "@/lib/dal/recipe";
import { isRateLimitedGlobally } from "@/lib/rate-limit/helper";
import { extractParts } from "@/lib/slug";
import { Actions } from "../actions";
import { WizardStep } from "../step";

type PageProps = {
  params: Promise<{
    slug: string;
    step: string;
  }>;
  searchParams: Promise<{
    servings: string;
  }>;
};

const Page = async (props: PageProps) => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";

  const searchParams = await props.searchParams;
  const params = await props.params;
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
      <ForceWakeLock />
      <div>
        <div className="mt-auto flex flex-col items-center justify-center py-8">
          <WizardStep
            description={displayedStep.description}
            ingredientScaleFactor={ingredientScaleFactor}
          />
          <div className="mt-4 text-sm">
            Step {step + 1} of {steps.length}
          </div>
        </div>
        <section className="flex justify-between border-t border-stone-100 py-4 dark:border-stone-800">
          <Actions
            slug={recipe.slug}
            publicId={recipe.publicId}
            stepCount={steps.length}
            step={step}
            servings={searchParams.servings}
          />
        </section>
      </div>
    </>
  );
};

export default Page;
