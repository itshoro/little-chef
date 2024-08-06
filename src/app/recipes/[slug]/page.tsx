import { validateRequest } from "@/lib/auth/lucia";
import {
  deleteRecipe,
  getCreatorsAndMaintainers,
  getRecipe,
  getRecipeSteps,
} from "@/lib/dal/recipe";
import { AvatarStack } from "@/app/components/header/avatar-stack";
import { IngredientList } from "./components/ingredient-list";
import { ServingsQueryStore } from "./components/servings-query-store";
import { DeleteButton } from "./components/buttons/delete-button";
import { extractParts } from "@/lib/slug";
import { Parser } from "@cooklang/cooklang-ts";
import Link from "next/link";
import type { Route } from "next";
import { notFound, redirect } from "next/navigation";
import { UserActions } from "./components/user-actions";
import { StartButton } from "./components/buttons/start-button";
import { Section } from "./components/section";
import { CookwareList } from "./components/cookware-list";
import type { Metadata, ResolvingMetadata } from "next";
import { MaintainerActions } from "./components/maintainer-actions";

type ShowRecipePageProps = {
  params: { slug: string };
  searchParams: { servings: string };
};

function generateAttribution(maintainers: { username: string }[]) {
  return new Intl.ListFormat(undefined, {
    type: "conjunction",
  }).format(maintainers.map((u) => u.username));
}

export async function generateMetadata(
  { params, searchParams }: ShowRecipePageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { publicId } = extractParts(params.slug);
  try {
    const recipe = await getRecipe({ publicId });
    const maintainers = await getCreatorsAndMaintainers(recipe.id);

    return {
      title: `${recipe.name} by ${generateAttribution(maintainers)}`,
      description: `In just ${recipe.cookingTime + recipe.preparationTime} minutes you could be done, yielding ${searchParams.servings} servings!`,
    };
  } catch {
    return parent as Metadata;
  }
}

const ShowRecipePage = async ({
  params,
  searchParams,
}: ShowRecipePageProps) => {
  try {
    const { user } = await validateRequest();
    const { publicId } = extractParts(params.slug);
    const recipe = await getRecipe({ publicId }, user?.publicId);

    const rawSteps = await getRecipeSteps(recipe.id);
    const parser = new Parser();
    const steps = rawSteps.map((step) => step.description);
    const parsedSteps = parser.parse(steps.join());

    const servingsFromSearchParams = parseInt(searchParams.servings);
    const defaultServingSize = isNaN(servingsFromSearchParams)
      ? recipe.recommendedServingSize
      : servingsFromSearchParams;

    const maintainers = await getCreatorsAndMaintainers(recipe.id);
    const attribution = generateAttribution(maintainers);

    return (
      <>
        <div>
          <div className="p-4 pt-6">
            <h1 className="font-medium">{recipe.name}</h1>
            <div className="mt-2 text-base">
              <div className="flex items-baseline justify-between">
                <div>
                  By{" "}
                  <span className="inline-block">
                    <AvatarStack users={maintainers} />
                  </span>{" "}
                  {attribution}
                </div>
                <section className="grid grid-flow-col gap-4">
                  <UserActions publicUserId={user?.publicId} recipe={recipe} />
                </section>
              </div>
            </div>

            <section className="my-4">
              <div className="flex items-center gap-4"></div>
            </section>

            <MaintainerActions
              user={user}
              maintainers={maintainers}
              recipe={recipe}
              slug={params.slug}
            />

            <Section title="Overview">
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <InfoCard>
                    <InfoCard.Value>
                      {recipe.preparationTime} minutes
                    </InfoCard.Value>
                    <InfoCard.Label>Preparation time</InfoCard.Label>
                  </InfoCard>
                  <InfoCard>
                    <InfoCard.Value>
                      {recipe.cookingTime} minutes
                    </InfoCard.Value>
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
            </Section>
            {parsedSteps.ingredients.length > 0 && (
              <Section title="Ingredients">
                <IngredientList
                  ingredients={parsedSteps.ingredients}
                  recommendedServingSize={recipe.recommendedServingSize}
                />
              </Section>
            )}
            {parsedSteps.cookwares.length > 0 && (
              <Section title="Cookware">
                <CookwareList cookwares={parsedSteps.cookwares} />
              </Section>
            )}
          </div>
        </div>

        <footer
          className="flex w-full border-t p-4 dark:border-stone-800"
          style={{ gridArea: "action", gridColumn: 1 }}
        >
          <div className="flex w-full items-end justify-between">
            <div>
              <div className="mb-2">Servings</div>
              <ServingsQueryStore min={0} defaultValue={defaultServingSize} />
            </div>
            <StartButton slug={params.slug} />
          </div>
        </footer>
      </>
    );
  } catch {
    notFound();
  }
};

const InfoCard = ({ children }: { children: React.ReactNode }) => (
  <div className="min-w-0 rounded-lg bg-stone-100 px-6 py-4 shadow-sm dark:bg-stone-900">
    {children}
  </div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm text-stone-600 dark:text-stone-400">{children}</div>
);

const Value = ({ children }: { children: React.ReactNode }) => (
  <div className="font-medium">{children}</div>
);

InfoCard.Label = Label;
InfoCard.Value = Value;

export default ShowRecipePage;
