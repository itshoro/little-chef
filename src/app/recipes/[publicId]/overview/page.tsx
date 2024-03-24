import { CTALink } from "@/app/components/CallToAction/Link";
import { getRecipeEntity, type Recipe } from "@/lib/recipes/actions/read";
import Link from "next/link";

type ShowRecipePageProps = {
  params: { publicId: string };
};

const ShowRecipePage = async ({ params }: ShowRecipePageProps) => {
  const recipe = await getRecipeEntity(params.publicId);

  return (
    <>
      {/* <header
        className="px-4 py-4"
        style={{ gridArea: "header", gridColumn: 1 }}
      >
        <div className="flex items-center gap-4">
          <Link href="/">
            <div className="rounded-lg p-1 bg-white ring-1 ring-black/5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </div>
          </Link>
          <h1 className="font-medium">{recipe.name}</h1>
        </div>
      </header> */}
      <div className="">
        <div className="p-4 pt-6">
          <section>
            <div className="flex items-center mb-4 gap-2">
              <span className="h-1 w-1 rounded-full bg-green-600 block" />
              <h2 className="text-sm font-medium">Overview</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <InfoCard>
                <InfoCard.Value>{recipe.totalDuration}</InfoCard.Value>
                <InfoCard.Label>Time needed</InfoCard.Label>
              </InfoCard>
              <InfoCard>
                <InfoCard.Value>{recipe.servings}</InfoCard.Value>
                <InfoCard.Label>Servings</InfoCard.Label>
              </InfoCard>
            </div>
          </section>
          {/* <section className="p-4 m-1 bg-white ring-1 ring-black/5 rounded-xl shadow"> */}
          <div className="mt-4">
            <section>
              <div>
                <div className="flex items-center mb-4 gap-2">
                  <span className="h-1 w-1 rounded-full bg-green-600 block" />
                  <h2 className="text-sm font-medium">Ingredients</h2>
                </div>
                <IngredientList ingredients={recipe.RecipeIngredient} />
              </div>
            </section>
          </div>
        </div>
      </div>

      <footer
        className="border-t w-full flex p-4"
        style={{ gridArea: "action", gridColumn: 1 }}
      >
        <div className="ml-auto">
          <CTALink href={`/recipes/${recipe.publicId}/overview/wizard/0`}>
            <div className="flex items-center gap-6">
              Start
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
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
  <div className="bg-white shadow-sm rounded-lg p-3">{children}</div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm">{children}</div>
);

const Value = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

const IngredientList = ({
  ingredients,
}: {
  ingredients: Recipe["RecipeIngredient"];
}) => {
  return (
    <>
      <ul className="grid md:grid-cols-2 gap-2">
        {ingredients.map((ingredient) => (
          <IngredientListItem
            key={ingredient.ingredientId}
            ingredient={ingredient}
          />
        ))}
      </ul>
      {/* <div className="mt-4">
        <button className="w-full text-center p-2 hover:bg-stone-100 rounded-2xl">
          See all
        </button>
      </div> */}
    </>
  );
};

const IngredientListItem = ({
  ingredient,
}: {
  ingredient: Recipe["RecipeIngredient"][number];
}) => {
  return (
    <li>
      <div className="bg-white shadow-sm rounded-2xl">
        <div className="p-2">
          <article className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="mr-2">
                <div className="p-2 bg-stone-100 aspect-square rounded-lg">
                  <div className="flex items-center justify-center">
                    <div className="m-auto">IMG</div>
                  </div>
                </div>
              </div>
              <div className="font-medium">
                {ingredient.Ingredient.name[0].name}
              </div>
            </div>
            <div className="text-stone-500 font-normal">
              <span>{ingredient.measurementAmount}</span>
              <span>{ingredient.measurementUnit}</span>
            </div>
            {/* <span className="flex-1 border-b border-dotted mx-4" /> */}
          </article>
        </div>
      </div>
    </li>
  );
};

InfoCard.Label = Label;
InfoCard.Value = Value;

export default ShowRecipePage;
