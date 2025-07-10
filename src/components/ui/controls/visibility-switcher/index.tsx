import { VISIBILITIES } from "@/lib/constants";
import { RadioCard, RadioCards } from "../radio-cards";
import { PrivateVisibility } from "./icon/private-visibility";
import { PublicVisibility } from "./icon/public-visibility";
import { UnlistedVisibility } from "./icon/unlisted-visibility";

type Visibility = (typeof VISIBILITIES)[number];

type VisibilitySwitcherProps = {
  defaultValue?: Visibility;
};

const iconMap: Record<
  Visibility,
  { icon: React.ReactNode; label: string; description: string }
> = {
  public: {
    icon: <PublicVisibility />,
    label: "Public",
    description: "Anyone can see the resource.",
  },
  unlisted: {
    icon: <UnlistedVisibility />,
    label: "Unlisted",
    description: "Anyone with the link to the resource can see it.",
  },
  private: {
    icon: <PrivateVisibility />,
    label: "Private",
    description: "Only you and invited users can see the resource.",
  },
};

const VisibilitySwitcher = ({ defaultValue }: VisibilitySwitcherProps) => {
  return (
    <RadioCards>
      {VISIBILITIES.map((visibility) => (
        <RadioCard
          value={visibility}
          key={visibility}
          icon={iconMap[visibility].icon}
          description={iconMap[visibility].description}
          defaultChecked={defaultValue === visibility}
        >
          {iconMap[visibility].label}
        </RadioCard>
      ))}
    </RadioCards>
  );
};

export { VisibilitySwitcher };
