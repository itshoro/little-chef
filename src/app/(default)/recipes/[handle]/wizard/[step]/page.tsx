import { ForceWakeLock } from "@/components/ui/wake-lock/force-wakelock";
import { isRateLimitedGlobally } from "@/lib/utils/rate-limit/global";
import { parseHandle } from "@/lib/slug";
import { validateSession } from "@/lib/utils/auth/validate-session";
import { getRecipeDetail } from "@/lib/utils/recipe/get-recipe-detail";
import { notFound } from "next/navigation";
import { Actions } from "../actions";
import { WizardStep } from "../step";

type PageProps = {
  params: Promise<{
    handle: string;
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
  const { user } = await validateSession();
  const { publicId } = parseHandle(params.handle);
  const recipeResult = await getRecipeDetail({ publicId }, user);
  if (!recipeResult.ok) throw recipeResult.error;

  const recipe = recipeResult.value;
  if (!recipe) notFound();

  const step = Math.min(Number(params.step) || 0, recipe.steps.length);
  const displayedStep = recipe.steps[step];

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
            Step {step + 1} of {recipe.steps.length}
          </div>
        </div>
        <section className="flex justify-between border-t border-stone-100 py-4 dark:border-stone-800">
          <Actions
            slug={recipe.slug}
            publicId={recipe.publicId}
            stepCount={recipe.steps.length}
            step={step}
            servings={searchParams.servings}
          />
        </section>
      </div>
    </>
  );
};

export default Page;
