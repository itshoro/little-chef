"use client";

import NextLink, { LinkProps } from "next/link";
import { useSearchParams } from "next/navigation";
import { useTabNavigationContext } from "./root";

type Props = {
  href: LinkProps<unknown>["href"];
  active?: boolean;
  children: React.ReactNode;
};

const Link = ({ href, children }: Props) => {
  const searchParams = useSearchParams();
  const { keepSearchParams, replace, pathname } = useTabNavigationContext(
    Link.name,
  );

  if (keepSearchParams) {
    href += `?${searchParams}`;
  }

  return (
    <li>
      <NextLink
        data-active={href.toString().startsWith(pathname)}
        className="block w-full rounded-full px-5 py-3 font-medium text-black data-[active=true]:bg-lime-300 dark:text-stone-500 dark:data-[active=true]:text-black"
        href={href}
        replace={replace}
      >
        {children}
      </NextLink>
    </li>
  );
};

export { Link };
