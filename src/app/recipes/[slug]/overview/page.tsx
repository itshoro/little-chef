import { CTALink } from "@/app/components/CallToAction/Link";
import { AvatarStack } from "@/app/components/header/avatar-stack";
import { validateRequest } from "@/lib/auth/lucia";
import {
  getCreatorsAndMaintainers,
  getRecipe,
  getRecipePreferences,
  getRecipeSteps,
} from "@/lib/dal/recipe";
import { extractParts } from "@/lib/slug";
import { Parser } from "@cooklang/cooklang-ts";
import { IngredientList } from "./components/ingredient-list";
import { AmountItem } from "./components/amount-item";
import { ServingsQueryStore } from "./components/servings-query-store";

type ShowRecipePageProps = {
  params: { slug: string };
  searchParams: { servings: string };
};

const ShowRecipePage = async ({
  params,
  searchParams,
}: ShowRecipePageProps) => {
  const { session, user } = await validateRequest();

  const { publicId } = extractParts(params.slug);
  const recipe = await getRecipe({ publicId }, session?.id);
  const maintainers = await getCreatorsAndMaintainers(recipe.id);

  const rawSteps = await getRecipeSteps(recipe.id);
  const parser = new Parser();

  const steps = rawSteps.map((step) => step.description);
  const parsedSteps = parser.parse(steps.join());

  const hasMaintainership = maintainers
    .map((maintainer) => maintainer.publicId)
    .includes(user!.publicId);

  const preferences = session
    ? await getRecipePreferences(session.id)
    : undefined;

  const servingsFromSearchParams = parseInt(searchParams.servings);
  const defaultServingSize = isNaN(servingsFromSearchParams)
    ? preferences?.defaultServingSize ?? recipe.recommendedServingSize
    : servingsFromSearchParams;

  return (
    <>
      <div>
        <div className="p-4 pt-6">
          <h1 className="font-medium">{recipe.name}</h1>
          <div className="mt-2 text-sm">
            By{" "}
            <span className="inline-block">
              <AvatarStack users={maintainers} />
            </span>{" "}
            {new Intl.ListFormat(undefined, { type: "conjunction" }).format(
              maintainers.map((u) => u.username),
            )}
          </div>
          <section className="mt-12">
            <div className="mb-4 flex items-center gap-2">
              <span className="block h-1 w-1 rounded-full bg-green-600" />
              <h2 className="text-sm font-medium">Overview</h2>
            </div>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-2 gap-4">
                <InfoCard>
                  <InfoCard.Value>
                    {recipe.preparationTime} minutes
                  </InfoCard.Value>
                  <InfoCard.Label>Preparation time</InfoCard.Label>
                </InfoCard>
                <InfoCard>
                  <InfoCard.Value>{recipe.cookingTime} minutes</InfoCard.Value>
                  <InfoCard.Label>Cooking time</InfoCard.Label>
                </InfoCard>
                <InfoCard>
                  <InfoCard.Value>
                    {recipe.recommendedServingSize}
                  </InfoCard.Value>
                  <InfoCard.Label>Servings recommended</InfoCard.Label>
                </InfoCard>
              </div>
            </div>
          </section>
          <section className="mt-12">
            <div className="mb-4 flex items-center gap-2">
              <span className="block h-1 w-1 rounded-full bg-green-600" />
              <h2 className="text-sm font-medium">Ingredients</h2>
            </div>
            <IngredientList
              ingredients={parsedSteps.ingredients}
              recommendedServingSize={recipe.recommendedServingSize}
            />
          </section>
          <section className="mt-12">
            <div className="mb-4 flex items-center gap-2">
              <span className="block h-1 w-1 rounded-full bg-green-600" />
              <h2 className="text-sm font-medium">Cookware</h2>
            </div>
            <ul>
              {parsedSteps.cookwares.map((cookware) => (
                <AmountItem label={cookware.name} amount={cookware.quantity} />
              ))}
            </ul>
          </section>
        </div>
      </div>

      <footer
        className="flex w-full border-t p-4"
        style={{ gridArea: "action", gridColumn: 1 }}
      >
        <div className="flex w-full items-end justify-between">
          <div>
            <div className="mb-2">Servings</div>
            <ServingsQueryStore defaultValue={defaultServingSize} />
          </div>
          <CTALink href={`/recipes/${params.slug}/overview/wizard/0`}>
            <div className="flex items-center gap-6">
              Start
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </CTALink>
        </div>
      </footer>
    </>
  );
};

const InfoCard = ({ children }: { children: React.ReactNode }) => (
  <div className="min-w-0 rounded-lg bg-stone-100 px-6 py-4 shadow-sm">
    {children}
  </div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm">{children}</div>
);

const Value = ({ children }: { children: React.ReactNode }) => (
  <div className="font-medium">{children}</div>
);

InfoCard.Label = Label;
InfoCard.Value = Value;

export default ShowRecipePage;
