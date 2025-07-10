import type { VISIBILITIES } from "@/lib/constants";
import { PrivateVisibility } from "./icon/private-visibility";
import { PublicVisibility } from "./icon/public-visibility";
import { UnlistedVisibility } from "./icon/unlisted-visibility";

const visibilityMap = {
  public: { label: "Public", icon: <PublicVisibility /> },
  unlisted: { label: "Unlisted", icon: <UnlistedVisibility /> },
  private: { label: "Private", icon: <PrivateVisibility /> },
} as const;

type ThemeOptionProps = {
  name: string;
  visibility: (typeof VISIBILITIES)[number];
  defaultValue?: (typeof VISIBILITIES)[number];
};

const VisibilityOption = ({
  name,
  visibility,
  defaultValue,
}: ThemeOptionProps) => {
  const { label, icon } = visibilityMap[visibility];

  return (
    <Input.Root name={name}>
      <Input.Group className="relative w-full flex-1">
        <Input.Element
          type="radio"
          className="peer checked:text-bg-300 absolute top-2 right-2 appearance-none rounded-full border-0 !bg-transparent before:absolute before:inset-1 before:rounded-full checked:ring-2 checked:ring-lime-300 checked:outline-none checked:before:bg-lime-300"
          value={visibility}
          id={visibility}
          defaultChecked={defaultValue === visibility}
        ></Input.Element>
        <Input.Label
          htmlFor={visibility}
          className="col-span-3 rounded-lg p-4 ring-1 ring-stone-200 transition ring-inset peer-checked:bg-lime-100 peer-checked:ring-2 peer-checked:ring-lime-300 dark:ring-stone-600 dark:peer-checked:bg-lime-900/30"
        >
          <div className="flex items-center justify-center gap-2">
            {/* using text-current/50 will lag behind */}
            <span className="text-current opacity-50">{icon}</span>
            <span className="text-sm font-medium">{label}</span>
          </div>
        </Input.Label>
      </Input.Group>
    </Input.Root>
  );
};

export { VisibilityOption };
