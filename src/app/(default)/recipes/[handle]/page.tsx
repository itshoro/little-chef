import { ServingsQueryStore } from "@/app/(default)/recipes/[handle]/_components/servings-query-store";
import { ShareCurrentPageButton } from "@/components/recipes/details/buttons/share-button";
import { IngredientList } from "@/components/recipes/details/ingredient-list";
import { LikeButton } from "@/components/recipes/details/user-actions";
import { ForceWakeLock } from "@/components/ui/wake-lock/force-wakelock";
import { Avatar } from "@/components/users/avatar";
import type { Collaborator } from "@/lib/domain/shared/collaborator";
import { generateHandle, parseHandle } from "@/lib/slug";
import { generateAttribution } from "@/lib/utils/attribution";
import { validateSession } from "@/lib/utils/auth/validate-session";
import { isRateLimitedGlobally } from "@/lib/utils/rate-limit/global";
import { getRecipeDetail } from "@/lib/utils/recipe/get-recipe-detail";
import { Parser } from "@cooklang/cooklang";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCollectionButton } from "./_components/add-to-collection-button";
import { RecipeActionButtons } from "./_components/recipe-action-buttons";
import { RecipeDescription } from "./_components/recipe-description";
import { ToWizardForm } from "./_components/to-wizard-form";

type ShowRecipePageProps = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ servings: string }>;
};

export async function generateMetadata(
  props: ShowRecipePageProps,
): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { publicId } = parseHandle(params.handle);
  const recipeResult = await getRecipeDetail({ publicId }, null);
  if (!recipeResult.ok) return {};

  const recipe = recipeResult.value;

  return {
    title: `${recipe.name} by ${generateAttribution(recipe.collaborators.map((c) => c.user))}`,
    description: `In just ${recipe.cookingTime + recipe.preparationTime} minutes you could be done, yielding ${searchParams.servings} servings!`,
  };
}

const ShowRecipePage = async (props: ShowRecipePageProps) => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";

  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);
  try {
    const { user } = await validateSession();
    const { publicId } = parseHandle(params.handle);
    const recipeResult = await getRecipeDetail({ publicId }, user);
    if (!recipeResult.ok) throw recipeResult.error;

    const recipe = recipeResult.value;
    if (!recipe) notFound();

    const parser = new Parser();
    const steps = recipe.steps.map((step) => step.description);
    const parsedRecipe = parser.parse(steps.join());

    const servingsFromSearchParams = parseInt(searchParams.servings);
    const defaultServingSize = isNaN(servingsFromSearchParams)
      ? recipe.recommendedServingSize
      : servingsFromSearchParams;

    return (
      <>
        <ForceWakeLock />
        <article className="grid grid-cols-[1rem_1fr_1rem]">
          <header className="contents">
            {recipe.cover && (
              <div className="relative isolate col-start-2 mb-4 w-full">
                <div className="absolute inset-0 z-10 rounded-3xl ring ring-black/5 ring-inset dark:ring-white/5" />
                <Image
                  alt=""
                  src={recipe.cover.url}
                  height={400}
                  width={320}
                  className="aspect-5/4 w-full rounded-3xl object-cover"
                  priority={true}
                  quality={85}
                />
              </div>
            )}

            <div className="col-start-2 flex">
              <section className="ml-auto flex gap-2">
                <ShareCurrentPageButton />
                <LikeButton
                  user={user}
                  recipe={recipe}
                  initialLikes={recipe.likes}
                />
                <AddToCollectionButton recipe={recipe} />
              </section>
            </div>

            <h1 className="col-start-2 my-4 text-2xl leading-snug font-medium text-balance">
              {recipe.name}
            </h1>

            <div className="col-start-2 mt-4 mb-6">
              <section
                className="isolate my-1 -ml-4 grid grid-cols-[auto_minmax(min-content,1fr)_auto] overflow-x-auto py-1"
                style={{
                  scrollbarColor:
                    "var(--color-stone-500) var(--color-stone-900)",
                }}
              >
                <div className="pointer-events-none sticky left-0 z-10 h-full w-4 bg-linear-to-l to-white dark:to-stone-900" />
                <div className="flex items-center gap-8 whitespace-nowrap">
                  <article>
                    <h3 className="mb-1 text-sm text-stone-400">Prep Time</h3>
                    <span className="font-medium">
                      {recipe.preparationTime} minutes
                    </span>
                  </article>
                  <article>
                    <h3 className="mb-1 text-sm text-stone-400">
                      Cooking Time
                    </h3>
                    <span className="font-medium">
                      {recipe.cookingTime} minutes
                    </span>
                  </article>
                  <article>
                    <h3 className="text-s mb-1 text-stone-400">Total Time</h3>
                    <span className="font-medium">
                      {recipe.preparationTime + recipe.cookingTime} minutes
                    </span>
                  </article>
                </div>
                <div className="pointer-events-none sticky right-0 z-10 flex items-end justify-end">
                  <div className="h-full w-8 bg-linear-to-r to-white dark:to-stone-900" />
                  <div className="pointer-events-auto relative">
                    <section className="relative z-10 ml-auto flex gap-2 pr-4"></section>
                    <div className="absolute top-0 h-full w-full bg-stone-900" />
                  </div>
                </div>
              </section>
            </div>

            <hr className="col-span-3 col-start-1 my-6 text-white/5" />

            <div className="col-start-2">
              <RecipeDescription
                collaborators={recipe.collaborators}
                description={recipe.description}
              />
            </div>

            <hr className="col-span-3 col-start-1 mt-4 text-white/5" />

            <section className="col-span-3 col-start-1 overflow-x-auto p-4 whitespace-nowrap">
              {/* Once more actions are being added, this needs to be a scroll-container on mobile devices. */}
              {user && <RecipeActionButtons recipe={recipe} user={user} />}
            </section>

            <hr className="col-span-3 col-start-1 text-white/5" />
          </header>

          <section className="col-start-2 mt-6">
            <div className="mb-6 flex w-full flex-wrap items-baseline justify-between gap-6">
              <h2 className="shrink text-sm font-medium text-stone-400">
                Ingredients
              </h2>
              <div className="pointer-events-auto">
                <ServingsQueryStore min={0} defaultValue={defaultServingSize} />
              </div>
            </div>

            {parsedRecipe.recipe.ingredients.length > 0 && (
              <IngredientList
                ingredients={parsedRecipe.recipe.ingredients}
                recommendedServingSize={recipe.recommendedServingSize}
              />
            )}
          </section>

          <footer className="pointer-events-none sticky bottom-0 isolate col-span-3 col-start-1 px-4 py-8">
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
        </article>
      </>
    );
  } catch (e) {
    console.error(e);
    notFound();
  }
};

const Attributions = ({ maintainers }: { maintainers: Collaborator[] }) => {
  return (
    <>
      {maintainers.map((maintainer) => (
        <article
          key={maintainer.user.publicId}
          className="inline-flex w-max shrink-0 items-center gap-2"
        >
          <Avatar src={maintainer.user.avatar?.url} alt="" size="size-8" />

          <span className="text-sm text-stone-400 capitalize">
            {maintainer.user.username}
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
