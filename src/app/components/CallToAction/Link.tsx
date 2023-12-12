import NextLink from "next/link";

type LinkProps = Omit<React.ComponentPropsWithoutRef<"a">, "className"> & {
  href: string | URL;
};

const Link = ({ children, ...props }: LinkProps) => (
  <NextLink
    {...props}
    className="inline-block group bg-gradient-to-t from-stone-100 border font-medium rounded-2xl active:shadow-inner shadow shadow-emerald-950/10 active:shadow-emerald-950/30 text-stone-700 transition-all"
  >
    <div className="group-active:translate-y-px transition inline-flex items-center p-2 pr-4">
      {children}
    </div>
  </NextLink>
);

export { Link as CTALink };
