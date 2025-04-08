import { BaseButton } from "@/app/components/base-button";
import { AvatarStack } from "@/app/components/header/avatar-stack";
import { validateRequest } from "@/lib/auth";
import {
  getCreatorsAndMaintainers,
  getRecipe,
  getRecipeSteps,
} from "@/lib/dal/recipe";
import { isRateLimitedGlobally } from "@/lib/rate-limit/helper";
import { extractParts } from "@/lib/slug";
import { generateAttribution } from "@/lib/utils";
import { Parser } from "@cooklang/cooklang-ts";
import type { Metadata, ResolvingMetadata } from "next";
import Form from "next/form";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CookwareList } from "./components/cookware-list";
import { IngredientList } from "./components/ingredient-list";
import { MaintainerActions } from "./components/maintainer-actions";
import { Section } from "./components/section";
import { ServingsQueryStore } from "./components/servings-query-store";
import { AddToCollection, LikeButton } from "./components/user-actions";

type ShowRecipePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ servings: string }>;
};

export async function generateMetadata(
  props: ShowRecipePageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
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
  if (await isRateLimitedGlobally("read")) return "Too many requests";

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
        <div className="grid gap-6">
          {recipe.coverSrc && (
            <div className="relative isolate w-full">
              <div className="absolute inset-0 z-10 rounded-3xl ring ring-black/30 ring-inset dark:ring-white/30" />
              <Image
                alt=""
                src={recipe.coverSrc}
                height={400}
                width={600}
                className="col-span-2 aspect-video w-full rounded-3xl object-cover"
              />
            </div>
          )}

          <div className="mb-4">
            <div className="flex flex-row items-start justify-between gap-2">
              <h1 className="mb-2 text-2xl font-semibold text-pretty">
                {recipe.name}
              </h1>
              <LikeButton
                className="h-12"
                disabled={!user}
                publicUserId={user?.publicId}
                recipe={recipe}
              />
            </div>
            <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
              <AvatarStack size="size-6" users={maintainers} />
              <span>{attribution}</span>
            </div>
          </div>

          <div className="grid auto-rows-[minmax(48px,_auto)] grid-cols-4 gap-6">
            <div className="col-span-2 grid flex-1 grid-cols-[auto_1fr] grid-rows-2 items-center gap-x-1.5 rounded-xl bg-stone-100 px-4 py-3 dark:bg-stone-900">
              <div className="col-span-2 grid grid-cols-subgrid items-center text-nowrap text-ellipsis text-stone-600 dark:text-stone-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="col-start-1 size-4 opacity-40"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 4a.75.75 0 0 1 .738.616l.252 1.388A1.25 1.25 0 0 0 6.996 7.01l1.388.252a.75.75 0 0 1 0 1.476l-1.388.252A1.25 1.25 0 0 0 5.99 9.996l-.252 1.388a.75.75 0 0 1-1.476 0L4.01 9.996A1.25 1.25 0 0 0 3.004 8.99l-1.388-.252a.75.75 0 0 1 0-1.476l1.388-.252A1.25 1.25 0 0 0 4.01 6.004l.252-1.388A.75.75 0 0 1 5 4ZM12 1a.75.75 0 0 1 .721.544l.195.682c.118.415.443.74.858.858l.682.195a.75.75 0 0 1 0 1.442l-.682.195a1.25 1.25 0 0 0-.858.858l-.195.682a.75.75 0 0 1-1.442 0l-.195-.682a1.25 1.25 0 0 0-.858-.858l-.682-.195a.75.75 0 0 1 0-1.442l.682-.195a1.25 1.25 0 0 0 .858-.858l.195-.682A.75.75 0 0 1 12 1ZM10 11a.75.75 0 0 1 .728.568.968.968 0 0 0 .704.704.75.75 0 0 1 0 1.456.968.968 0 0 0-.704.704.75.75 0 0 1-1.456 0 .968.968 0 0 0-.704-.704.75.75 0 0 1 0-1.456.968.968 0 0 0 .704-.704A.75.75 0 0 1 10 11Z"
                    clipRule="evenodd"
                  />
                </svg>

                <span className="col-start-2 overflow-hidden text-sm font-medium text-ellipsis">
                  Prep time
                </span>
              </div>
              <span className="col-start-2 row-start-2 text-lg font-semibold">
                {recipe.preparationTime} min
              </span>
            </div>

            <div className="col-span-2 grid flex-1 grid-cols-[auto_1fr] grid-rows-2 items-center gap-x-1.5 rounded-xl bg-stone-100 px-4 py-3 dark:bg-stone-900">
              <div className="col-span-2 grid grid-cols-subgrid grid-rows-subgrid items-center text-nowrap text-ellipsis text-stone-600 dark:text-stone-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="col-start-1 row-start-2 size-4 opacity-40"
                >
                  <path
                    fillRule="evenodd"
                    d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7.75-4.25a.75.75 0 0 0-1.5 0V8c0 .414.336.75.75.75h3.25a.75.75 0 0 0 0-1.5h-2.5v-3.5Z"
                    clipRule="evenodd"
                  />
                </svg>

                <span className="col-start-2 overflow-hidden text-sm font-medium text-ellipsis">
                  Cooking time
                </span>
              </div>
              <span className="col-start-2 row-start-2 text-lg font-semibold">
                {recipe.cookingTime} min
              </span>
            </div>
          </div>

          {parsedSteps.cookwares.length > 0 && (
            <Section title="Cookware">
              <CookwareList cookwares={parsedSteps.cookwares} />
            </Section>
          )}

          {parsedSteps.ingredients.length > 0 && (
            <Section title="Ingredients">
              <IngredientList
                ingredients={parsedSteps.ingredients}
                recommendedServingSize={recipe.recommendedServingSize}
              />
            </Section>
          )}

          {user && (
            <div className="grid grid-cols-2 gap-6">
              <AddToCollection
                publicUserId={user.publicId}
                recipe={recipe}
                className="col-span-2"
              />
              <MaintainerActions
                user={user}
                maintainers={maintainers}
                recipe={recipe}
                slug={params.slug}
              />
            </div>
          )}
        </div>
        <footer className="pointer-events-none sticky bottom-0 isolate -mx-4 px-4 py-8">
          <span
            className="absolute inset-0 fill-black backdrop-blur"
            style={{
              mask: "linear-gradient(to bottom, transparent 50%, currentColor 75%)",
            }}
          />
          <span
            className="absolute inset-0 fill-black backdrop-blur-sm"
            style={{
              mask: "linear-gradient(to bottom, transparent 25%, currentColor 50%)",
            }}
          />
          <span
            className="absolute inset-0 fill-black backdrop-blur-xs"
            style={{
              mask: "linear-gradient(to bottom, transparent 0%, currentColor 25%)",
            }}
          />
          <div className="relative isolate z-10">
            <Form
              action={`/recipes/${params.slug}/wizard/0`}
              className="flex max-w-full flex-1 flex-wrap items-end justify-end gap-8"
            >
              <div className="pointer-events-auto flex w-full flex-1 items-baseline gap-4 sm:w-auto sm:flex-initial">
                <ServingsQueryStore min={0} defaultValue={defaultServingSize} />
              </div>
              <BaseButton type="submit" className="pointer-events-auto">
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
              </BaseButton>
            </Form>
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
