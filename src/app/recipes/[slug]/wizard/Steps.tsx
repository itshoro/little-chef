import { CooklangPreview } from "../components/cooklang-preview";

const WizardSteps = ({
  description,
  ingredientScaleFactor,
}: {
  description: string;
  ingredientScaleFactor: number;
}) => {
  return (
    <div className="my-auto p-4">
      <div className="w-full text-xl">
        <div
          className="mx-auto text-balance rounded-2xl bg-white px-3 py-2 text-center shadow-sm aria-[current=false]:scale-90 aria-[current=false]:opacity-60"
          aria-current={true}
        >
          <CooklangPreview
            value={description}
            ingredientScaleFactor={ingredientScaleFactor}
          />
        </div>
      </div>
    </div>
  );
};

export { WizardSteps };
