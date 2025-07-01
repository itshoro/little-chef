import { Cookware } from "@cooklang/cooklang-ts";
import { AmountItem } from "./amount-item";

type CookwareListProps = {
  cookwares: Cookware[];
};

const CookwareList = ({ cookwares }: CookwareListProps) => {
  return (
    <ul className="grid gap-2">
      {cookwares.map((cookware) => (
        <li key={cookware.name}>
          <AmountItem label={cookware.name} amount={cookware.quantity} />
        </li>
      ))}
    </ul>
  );
};

export { CookwareList };
