import { CooklangPreview } from "../components/cooklang-preview";

const WizardStep = ({
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
          className="mx-auto text-balance rounded-2xl border px-3 py-2 text-center shadow-sm aria-[current=false]:scale-90 aria-[current=false]:opacity-60 dark:border-stone-700"
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

export { WizardStep };
