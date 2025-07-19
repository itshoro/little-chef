import { CooklangPreview } from "@/components/recipes/details/cooklang-preview";

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
        className="mx-auto rounded-2xl bg-stone-100 p-4 text-left text-balance shadow-xs aria-[current=false]:scale-90 aria-[current=false]:opacity-60 dark:bg-stone-900"
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
