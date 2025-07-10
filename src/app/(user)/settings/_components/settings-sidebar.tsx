import Link from "next/link";
import { Navigation } from "./navigation";

const SettingsSidebar = ({ showMenu }: { showMenu: boolean }) => {
  return (
    <div className={"block lg:hidden"}>
      {showMenu ? (
        <Navigation />
      ) : (
        <BackToOrigin label="Back to Settings" href="/settings" />
      )}
    </div>
  );
};

type BackToSettingsProps = {
  label: string;
  href: string;
};

const BackToOrigin = ({ href, label }: BackToSettingsProps) => {
  return (
    <Link
      href={href}
      className="block border-b border-stone-800 px-4 py-6 text-sm"
    >
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="size-4"
        >
          <path
            fillRule="evenodd"
            d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z"
            clipRule="evenodd"
          />
        </svg>
        <div>{label}</div>
      </div>
    </Link>
  );
};

export { SettingsSidebar };
