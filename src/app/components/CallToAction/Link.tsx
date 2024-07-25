import NextLink from "next/link";
import type { Route } from "next";

type LinkProps<T extends string> = Omit<
  React.ComponentPropsWithoutRef<"a">,
  "className"
> & {
  href: Route<T> | URL;
};

const Link = <T extends string>({ children, href, ...props }: LinkProps<T>) => (
  <NextLink
    {...props}
    href={href as Route}
    className="group inline-block rounded-2xl border bg-gradient-to-t from-stone-100 to-white font-medium text-stone-700 shadow shadow-emerald-950/10 transition-all active:shadow-inner active:shadow-emerald-950/30"
  >
    <div className="inline-flex items-center p-2 pr-4 transition group-active:translate-y-px">
      {children}
    </div>
  </NextLink>
);

export { Link as CTALink };
