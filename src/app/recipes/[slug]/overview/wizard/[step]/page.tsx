import { getRecipeEntity } from "@/lib/recipes/actions/read";
import WizardView from "../view";

type PageProps = {
  params: {
    publicId: string;
    step: string;
  };
};

const Page = async ({ params }: PageProps) => {
  const recipe = await getRecipeEntity(params.publicId);
  const step = isNaN(Number(params.step)) ? 0 : Number(params.step);

  return <WizardView step={step} recipe={recipe} />;
};

export default Page;
