import { validateRequest } from "@/lib/auth/lucia";
import {
  deleteRecipe,
  getCreatorsAndMaintainers,
  getRecipe,
  getRecipeSteps,
} from "@/lib/dal/recipe";
import { AvatarStack } from "@/app/components/header/avatar-stack";
import { AmountItem } from "./components/amount-item";
import { IngredientList } from "./components/ingredient-list";
import { ServingsQueryStore } from "./components/servings-query-store";
import { DeleteButton } from "./components/buttons/delete-button";
import { extractParts } from "@/lib/slug";
import { Parser } from "@cooklang/cooklang-ts";
import Link from "next/link";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { UserActions } from "./components/user-actions";
import { StartButton } from "./components/buttons/start-button";

type ShowRecipePageProps = {
  params: { slug: string };
  searchParams: { servings: string };
};

const ShowRecipePage = async ({
  params,
  searchParams,
}: ShowRecipePageProps) => {
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
  const hasMaintainership = maintainers
    .map((maintainer) => maintainer.publicId)
    // @ts-expect-error
    .includes(user?.publicId);

  const attribution = new Intl.ListFormat(undefined, {
    type: "conjunction",
  }).format(maintainers.map((u) => u.username));

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
              <section className="mt-4 grid grid-flow-col gap-4">
                {hasMaintainership && (
                  <>
                    <DeleteButton
                      deleteAction={async () => {
                        "use server";

                        await deleteRecipe(recipe.id);
                        redirect("/recipes");
                      }}
                    />
                    <EditButton href={`/recipes/${params.slug}/edit`} />
                  </>
                )}
              </section>
            </div>
          </div>

          <section className="my-4">
            <div className="flex items-center gap-4">
              <UserActions publicUserId={user?.publicId} recipe={recipe} />
            </div>
          </section>

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
          {parsedSteps.ingredients.length > 0 && (
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
          )}
          {parsedSteps.cookwares.length > 0 && (
            <section className="mt-12">
              <div className="mb-4 flex items-center gap-2">
                <span className="block h-1 w-1 rounded-full bg-green-600" />
                <h2 className="text-sm font-medium">Cookware</h2>
              </div>
              <ul className="grid gap-2">
                {parsedSteps.cookwares.map((cookware) => (
                  <li key={cookware.name}>
                    <AmountItem
                      label={cookware.name}
                      amount={cookware.quantity}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      <footer
        className="flex w-full border-t p-4"
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
};

const EditButton = ({ href }: { href: Route }) => {
  return (
    <Link
      href={href}
      className="inline-flex justify-center rounded-xl border-2 px-6 py-4 shadow active:bg-neutral-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="size-4"
      >
        <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
        <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
      </svg>

      <span className="sr-only">Edit</span>
    </Link>
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
