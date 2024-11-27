import { AvatarStack } from "@/app/components/header/avatar-stack";
import { validateRequest } from "@/lib/auth/lucia";
import {
  getCreatorsAndMaintainers,
  getRecipe,
  getRecipeSteps,
} from "@/lib/dal/recipe";
import { extractParts } from "@/lib/slug";
import { generateAttribution } from "@/lib/utils";
import { Parser } from "@cooklang/cooklang-ts";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { ShareCurrentPageButton } from "./components/buttons/share-button";
import { StartButton } from "./components/buttons/start-button";
import { CookwareList } from "./components/cookware-list";
import { IngredientList } from "./components/ingredient-list";
import { MaintainerActions } from "./components/maintainer-actions";
import { Section } from "./components/section";
import { ServingsQueryStore } from "./components/servings-query-store";
import { AddToCollection, LikeButton } from "./components/user-actions";
import Image from "next/image";

type ShowRecipePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ servings: string }>;
};

export async function generateMetadata(props: ShowRecipePageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const params = await props.params;
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

const ShowRecipePage = async (props: ShowRecipePageProps) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
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
          {recipe.coverSrc && (
            <Image
              alt=""
              src={recipe.coverSrc}
              height={400}
              width={600}
              className="h-64 w-full object-cover"
            />
          )}
          <div className="p-4">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <h1 className="text-xl font-medium">{recipe.name}</h1>
                <div className="flex items-center gap-1 text-sm">
                  <AvatarStack users={maintainers} />
                  <span>{attribution}</span>
                </div>
                <div className="my-4 text-stone-600 dark:text-stone-400">
                  {recipe.description}
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-center gap-2">
                <ShareCurrentPageButton />
                <LikeButton
                  disabled={!user}
                  publicUserId={user?.publicId}
                  recipe={recipe}
                />
              </div>
            </div>

            <div className="-mx-4 my-4 border-y border-dashed bg-stone-100 px-4 py-8 dark:border-stone-700 dark:bg-stone-900">
              <Section title="Actions">
                <div className="grid grid-cols-2 gap-4">
                  <MaintainerActions
                    user={user}
                    maintainers={maintainers}
                    recipe={recipe}
                    slug={params.slug}
                  />
                  <AddToCollection
                    publicUserId={user?.publicId}
                    recipe={recipe}
                  />
                </div>
              </Section>
            </div>

            <div className="my-8">
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
            </div>

            {parsedSteps.ingredients.length > 0 && (
              <div className="my-8">
                <Section title="Ingredients">
                  <IngredientList
                    ingredients={parsedSteps.ingredients}
                    recommendedServingSize={recipe.recommendedServingSize}
                  />
                </Section>
              </div>
            )}
            {parsedSteps.cookwares.length > 0 && (
              <div className="my-8">
                <Section title="Cookware">
                  <CookwareList cookwares={parsedSteps.cookwares} />
                </Section>
              </div>
            )}
          </div>
        </div>

        <footer
          className="flex w-full border-t p-4 dark:border-stone-800"
          style={{ gridArea: "action", gridColumn: 1 }}
        >
          <div className="flex max-w-full flex-1 flex-wrap items-end justify-end gap-4 sm:justify-between">
            <div className="w-full sm:w-fit">
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
  <div className="min-w-0 rounded-lg bg-stone-100 px-6 py-4 shadow-xs dark:bg-stone-900">
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
