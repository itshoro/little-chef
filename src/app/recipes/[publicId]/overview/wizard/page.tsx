import { getRecipe } from "@/lib/recipes/actions";
import { Actions } from "./Actions";
import { WizardSteps } from "./Steps";

type WizardPageProps = {
  params: {
    publicId: string;
  };
};

const WizardPage = async ({ params }: WizardPageProps) => {
  const recipe = await getRecipe(params.publicId);

  return (
    <>
      <div className="flex">
        <WizardSteps steps={recipe.RecipeStep} />
      </div>
      <section
        className="flex border-t p-4 justify-between"
        style={{ gridArea: "action", gridColumn: 1 }}
      >
        <Actions recipe={recipe} />
      </section>
    </>
  );
};

export default WizardPage;
