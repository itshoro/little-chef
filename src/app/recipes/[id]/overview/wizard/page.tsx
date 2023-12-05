import { get } from "@/lib/recipes/actions/retrieve";
import { Actions } from "./Actions";
import { WizardSteps } from "./Steps";

type WizardPageProps = {
  params: {
    id: string;
  };
};

const WizardPage = async ({ params }: WizardPageProps) => {
  const recipe = await get(params.id);

  return (
    <>
      <div className="flex">
        <WizardSteps steps={recipe.steps} />
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
