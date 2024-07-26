import { Parser } from "@cooklang/cooklang-ts";
import { CooklangPreview } from "../../components/cooklang-preview";

const WizardSteps = ({ description }: { description: string }) => {
  return (
    <div className="my-auto p-4">
      <div className="w-full text-xl">
        <ul className="w-full space-y-2">
          <WizardStep current={true} description={description} />
        </ul>
      </div>
    </div>
  );
};

const WizardStep = ({
  description,
  current = true,
}: {
  description: string;
  current: boolean;
}) => {
  return (
    <li>
      <div
        className="mx-auto text-balance rounded-2xl bg-white px-3 py-2 text-center shadow-sm aria-[current=false]:scale-90 aria-[current=false]:opacity-60"
        aria-current={current}
      >
        <CooklangPreview value={description} />
      </div>
    </li>
  );
};

export { WizardSteps };
