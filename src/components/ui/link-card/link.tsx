import type { Route } from "next";
import NextLink from "next/link";

type LinkProps<T extends string> = {
  href: Route<T> | URL;
  children: React.ReactNode;
};

const Link = <T extends string>({ children, href }: LinkProps<T>) => (
  <NextLink className="absolute inset-0 h-full w-full" href={href as Route<T>}>
    <span className="sr-only">{children}</span>
  </NextLink>
);

export { Link };
