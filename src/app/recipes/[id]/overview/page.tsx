import { CTALink } from "@/app/components/CallToAction/Link";
import { get } from "@/lib/recipes/actions/retrieve";

type ShowRecipePageProps = {
  params: { id: string };
};

const ShowRecipePage = async ({ params }: ShowRecipePageProps) => {
  const recipe = await get(params.id);

  return (
    <>
      <header
        className="px-4 py-4"
        style={{ gridArea: "header", gridColumn: 1 }}
      >
        <h1>{recipe.name}</h1>
      </header>
      <div>
        <section className="px-4 py-2">
          <div className="grid grid-cols-3 gap-4">
            <InfoCard>
              <InfoCard.Value>{recipe.totalDuration}</InfoCard.Value>
              <InfoCard.Label>Time needed</InfoCard.Label>
            </InfoCard>
            <InfoCard>
              <InfoCard.Value>{recipe.steps.length}</InfoCard.Value>
              <InfoCard.Label>Steps</InfoCard.Label>
            </InfoCard>
            <InfoCard>
              <InfoCard.Value>{recipe.servings}</InfoCard.Value>
              <InfoCard.Label>Servings</InfoCard.Label>
            </InfoCard>
          </div>
        </section>
        <section className="px-4 py-2">
          <h2 className="text-sm uppercase font-medium">Ingredients</h2>
          <ul>
            <li></li>
          </ul>
        </section>
        <section className="px-4 py-2">
          <h2 className="text-sm uppercase font-medium">Steps</h2>
          <ul>
            <li></li>
          </ul>
        </section>
      </div>
      <footer
        className="border-t w-full flex p-4"
        style={{ gridArea: "action", gridColumn: 1 }}
      >
        <div className="ml-auto">
          <CTALink href={`/recipes/${recipe.id}/overview/wizard`}>
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
  <div className="bg-gray-200 rounded-lg p-3">{children}</div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm">{children}</div>
);

const Value = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

InfoCard.Label = Label;
InfoCard.Value = Value;

export default ShowRecipePage;
