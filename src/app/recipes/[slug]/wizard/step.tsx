import { CooklangPreview } from "../components/cooklang-preview";

const WizardStep = ({
  description,
  ingredientScaleFactor,
}: {
  description: string;
  ingredientScaleFactor: number;
}) => {
  return (
    <div className="w-full text-xl">
      <div
        className="mx-auto text-balance rounded-2xl border p-4 text-left shadow-xs aria-[current=false]:scale-90 aria-[current=false]:opacity-60 dark:border-stone-700"
        aria-current={true}
      >
        <CooklangPreview
          value={description}
          ingredientScaleFactor={ingredientScaleFactor}
        />
      </div>
    </div>
  );
};

export { WizardStep };
