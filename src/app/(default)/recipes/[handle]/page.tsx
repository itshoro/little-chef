import { ServingsQueryStore } from "@/app/(default)/recipes/[handle]/_components/servings-query-store";
import { ShareCurrentPageButton } from "@/components/recipes/details/buttons/share-button";
import { IngredientList } from "@/components/recipes/details/ingredient-list";
import { LikeButton } from "@/components/recipes/details/user-actions";
import { LinkButton } from "@/components/ui/buttons/link-button";
import { ForceWakeLock } from "@/components/ui/wake-lock/force-wakelock";
import { Avatar } from "@/components/users/avatar";
import { getAuthenticatedUserFromRequest } from "@/lib/services/auth";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import { getRecipeDetailByIdentifier } from "@/lib/services/recipe";
import type { UserOutputPublicDTO } from "@/lib/services/user/types";
import { generateHandle, parseHandle } from "@/lib/slug";
import { generateAttribution } from "@/lib/utils/attribution";
import { Parser } from "@cooklang/cooklang-ts";
import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCollectionButton } from "./_components/add-to-collection-button";
import { DeleteRecipeButton } from "./_components/delete-button";
import { ToWizardForm } from "./_components/to-wizard-form";
import { CooklangPreview } from "@/components/recipes/details/cooklang-preview";

type ShowRecipePageProps = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ servings: string }>;
};

export async function generateMetadata(
  props: ShowRecipePageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { publicId } = parseHandle(params.handle);
  try {
    const { recipe, maintainers } = await getRecipeDetailByIdentifier(
      { publicId },
      null,
    );

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

  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);
  try {
    const { user } = await getAuthenticatedUserFromRequest();
    const { publicId } = parseHandle(params.handle);
    const {
      recipe,
      maintainers,
      steps: rawSteps,
    } = await getRecipeDetailByIdentifier({ publicId }, user);

    const parser = new Parser();
    const steps = rawSteps.map((step) => step.description);
    const parsedSteps = parser.parse(steps.join());

    const servingsFromSearchParams = parseInt(searchParams.servings);
    const defaultServingSize = isNaN(servingsFromSearchParams)
      ? recipe.recommendedServingSize
      : servingsFromSearchParams;

    return (
      <>
        <ForceWakeLock />
        <article className="grid grid-flow-row-dense grid-rows-[repeat(3,minmax(auto,min-content))] gap-8 lg:grid-cols-3 lg:grid-rows-2">
          <div className="row-start-1 mx-6 lg:col-span-2">
            <header className="mb-8">
              <h1 className="mb-2 text-2xl font-medium">{recipe.name}</h1>
              <div className="flex items-center gap-2">
                <span>By</span>
                <Attributions maintainers={maintainers} />
              </div>
            </header>
            {recipe.coverSrc && (
              <div className="mb-4">
                <div className="relative isolate w-full">
                  <div className="absolute inset-0 z-10 rounded-3xl ring ring-black/5 ring-inset dark:ring-white/5" />
                  <Image
                    alt=""
                    src={recipe.coverSrc}
                    height={400}
                    width={320}
                    className="aspect-[5/4] w-full rounded-3xl object-cover"
                    priority={true}
                    quality={85}
                  />
                </div>
              </div>
            )}

            <section className="mb-4 flex flex-wrap gap-2">
              <LikeButton
                user={user}
                disabled={user === null}
                recipeIdentifier={recipe}
                initialLikes={recipe.likes}
              />
              <AddToCollectionButton recipeIdentifier={recipe} />
              <ShareCurrentPageButton />
              <LinkButton
                variant="outline"
                href={`/recipes/${generateHandle(recipe.slug, recipe.publicId)}/edit`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="size-4 text-stone-600"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.013 2.513a1.75 1.75 0 0 1 2.475 2.474L6.226 12.25a2.751 2.751 0 0 1-.892.596l-2.047.848a.75.75 0 0 1-.98-.98l.848-2.047a2.75 2.75 0 0 1 .596-.892l7.262-7.261Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-white">Edit</span>
              </LinkButton>
              <DeleteRecipeButton recipeIdentifier={recipe} />
            </section>

            <div className="mb-8 flex items-center gap-8 whitespace-nowrap">
              <article>
                <h3 className="text-stone-400">Prep Time</h3>
                <span className="font-medium">
                  {recipe.preparationTime} min
                </span>
              </article>
              <article>
                <h3 className="text-stone-400">Cooking Time</h3>
                <span className="font-medium">{recipe.cookingTime} min</span>
              </article>
              <article>
                <h3 className="text-stone-400">Total Time</h3>
                <span className="font-medium">
                  {recipe.preparationTime + recipe.cookingTime} min
                </span>
              </article>
            </div>
          </div>

          <div className="row-start-3 mx-6 lg:col-span-2 lg:col-start-1 lg:row-auto">
            <section className="border-t border-current/10 pt-8">
              <h2 className="text-lg font-medium">Instructions</h2>

              <ol>
                {rawSteps.map((step, index) => (
                  <li
                    key={index}
                    className="mt-4 mb-6 flex items-baseline gap-4 text-stone-400"
                  >
                    <div className="grid size-8 shrink-0 place-items-center rounded-full bg-stone-800 text-sm font-medium text-white select-none">
                      {index + 1}
                    </div>
                    <CooklangPreview value={step.description} />
                  </li>
                ))}
              </ol>
            </section>
          </div>
          <div className="row-start-2 lg:col-start-3 lg:row-span-full lg:row-start-1 lg:border-l lg:border-current/10">
            <section className="sticky top-0 flex h-screen flex-col">
              <div className="overflow-y-auto">
                <div className="sticky top-0">
                  <header className="border-b border-current/10 bg-white px-8 py-4 dark:bg-stone-900">
                    <div className="dark:bg-stone-900">
                      <div className="flex items-baseline justify-between gap-4">
                        <h2 className="text-lg font-medium">Ingredients</h2>
                        <div className="flex items-baseline gap-2">
                          <ServingsQueryStore
                            min={0}
                            defaultValue={defaultServingSize}
                          />
                          <span className="text-sm text-stone-400">
                            servings
                          </span>
                        </div>
                      </div>
                    </div>
                  </header>
                  <div className="h-8 bg-gradient-to-b from-white dark:from-stone-900" />
                </div>
                <div className="px-8">
                  <IngredientList
                    ingredients={parsedSteps.ingredients}
                    recommendedServingSize={defaultServingSize}
                  />
                </div>
                <div className="sticky bottom-0 h-8 bg-gradient-to-t from-white dark:from-stone-900" />
              </div>
            </section>
          </div>
        </article>

        {/* <article>
          <header className="border-b border-white/5 pb-6">
            {recipe.coverSrc && (
              <div className="mb-4 px-4">
                <div className="relative isolate w-full">
                  <div className="absolute inset-0 z-10 rounded-3xl ring ring-black/5 ring-inset dark:ring-white/5" />
                  <Image
                    alt=""
                    src={recipe.coverSrc}
                    height={400}
                    width={320}
                    className="aspect-[5/4] w-full rounded-3xl object-cover"
                    priority={true}
                    quality={85}
                  />
                </div>
              </div>
            )}

            <section
              className="isolate my-1 grid grid-cols-[auto_minmax(min-content,1fr)_auto] overflow-x-auto py-1"
              style={{
                scrollbarColor: "var(--color-stone-500) var(--color-stone-900)",
              }}
            >
              <div className="pointer-events-none sticky left-0 z-10 h-full w-4 bg-gradient-to-l to-stone-900" />
              <div className="flex items-center gap-4">
                <Attributions maintainers={maintainers} />
              </div>
              <div className="pointer-events-none sticky right-0 z-10 flex">
                <div className="h-full w-8 bg-gradient-to-r to-stone-900" />
                <div className="pointer-events-auto relative flex">
                  <section className="relative z-10 ml-auto flex gap-2 pr-4">
                    <ShareCurrentPageButton />
                    <LikeButton
                      user={user}
                      disabled={user === null}
                      recipeIdentifier={recipe}
                      initialLikes={recipe.likes}
                    />
                  </section>
                  <div className="absolute top-0 h-full w-full bg-stone-900" />
                </div>
              </div>
            </section>

            <div className="mt-4 px-4">
              <div className="mb-12">
                <h1 className="mb-3 text-2xl leading-snug font-medium text-balance">
                  {recipe.name}
                </h1>
                <p className="leading-relaxed text-pretty text-stone-400">
                  {recipe.description}
                </p>
              </div>

              <section className="-mx-4 whitespace-nowrap">
                {user && <RecipeActionButtons recipe={recipe} user={user} />}
              </section>
            </div>
          </header>

          <div className="my-8">
            <section
              className="isolate my-1 grid grid-cols-[auto_minmax(min-content,1fr)_auto] overflow-x-auto py-1"
              style={{
                scrollbarColor: "var(--color-stone-500) var(--color-stone-900)",
              }}
            >
              <div className="pointer-events-none sticky left-0 z-10 h-full w-4 bg-gradient-to-l to-stone-900" />
              <div className="flex items-center gap-8 whitespace-nowrap">
                <article>
                  <h3 className="text-stone-400">Prep Time</h3>
                  <span className="font-medium">
                    {recipe.preparationTime} min
                  </span>
                </article>
                <article>
                  <h3 className="text-stone-400">Cooking Time</h3>
                  <span className="font-medium">{recipe.cookingTime} min</span>
                </article>
                <article>
                  <h3 className="text-stone-400">Total Time</h3>
                  <span className="font-medium">
                    {recipe.preparationTime + recipe.cookingTime} min
                  </span>
                </article>
              </div>
              <div className="pointer-events-none sticky right-0 z-10 flex items-end justify-end">
                <div className="h-full w-8 bg-gradient-to-r to-stone-900" />
                <div className="pointer-events-auto relative">
                  <section className="relative z-10 ml-auto flex gap-2 pr-4"></section>
                  <div className="absolute top-0 h-full w-full bg-stone-900" />
                </div>
              </div>
            </section>
          </div>

          <section className="my-12 px-4">
            <div className="mb-6">
              <div className="flex w-full flex-wrap items-baseline justify-between gap-6">
                <h2 className="shrink text-xl font-medium">Ingredients</h2>
                <div className="pointer-events-auto">
                  <ServingsQueryStore
                    min={0}
                    defaultValue={defaultServingSize}
                  />
                </div>
              </div>
            </div>
            /** TODO: add Cookware list */
        /* {parsedSteps.cookwares.length > 0 && (
              <CookwareList cookwares={parsedSteps.cookwares} />
            )} 

            {parsedSteps.ingredients.length > 0 && (
              <IngredientList
                ingredients={parsedSteps.ingredients}
                recommendedServingSize={recipe.recommendedServingSize}
              />
            )}
          </section>

          <footer className="pointer-events-none sticky bottom-0 isolate px-4 py-8">
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
              <ToWizardForm
                defaultServings={recipe.recommendedServingSize}
                handle={generateHandle(recipe.slug, recipe.publicId)}
              />
            </div>
          </footer>
        </article> */}
      </>
    );
  } catch {
    notFound();
  }
};

const Attributions = ({
  maintainers,
}: {
  maintainers: UserOutputPublicDTO[];
}) => {
  return (
    <>
      {maintainers.map((maintainer) => (
        <article
          key={maintainer.publicId}
          className="inline-flex w-max shrink-0 items-center gap-2"
        >
          {maintainer.avatar && (
            <Avatar src={maintainer.avatar} alt="" size="size-8" />
          )}

          <span className="text-sm text-stone-400 capitalize">
            {maintainer.username}
          </span>
        </article>
      ))}
    </>
  );
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
