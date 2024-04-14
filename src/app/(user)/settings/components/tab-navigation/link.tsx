import NextLink from "next/link";

type LinkProps = {
  href: string;
  active?: boolean;
  children: React.ReactNode;
};

const Link = ({ href, children }: LinkProps) => (
  <li>
    <NextLink
      className="block w-full rounded-full px-5 py-3 font-medium text-black"
      href={href}
    >
      {children}
    </NextLink>
  </li>
);

export { Link };
