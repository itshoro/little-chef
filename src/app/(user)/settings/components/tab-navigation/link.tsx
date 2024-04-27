"use client";

import NextLink, { LinkProps } from "next/link";
import { useTabNavigationContext } from "./root";
import { useSearchParams } from "next/navigation";

type Props = {
  href: LinkProps<unknown>["href"];
  active?: boolean;
  children: React.ReactNode;
};

const Link = ({ href, children }: Props) => {
  const searchParams = useSearchParams();
  const { keepSearchParams } = useTabNavigationContext(Link.name);

  if (keepSearchParams) {
    href += `?${searchParams}`;
  }

  return (
    <li>
      <NextLink
        className="block w-full rounded-full px-5 py-3 font-medium text-black"
        href={href}
      >
        {children}
      </NextLink>
    </li>
  );
};

export { Link };
