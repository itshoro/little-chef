"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigation = ({ className }: { className?: string }) => {
  return (
    <nav className={["flex flex-col", className].filter(Boolean).join(" ")}>
      <Item label="General" href="/settings/user" />
      <Item label="Collection" href="/settings/collection" />
      <Item label="Recipe" href="/settings/recipe" />
      <Item label="History" href="/settings/history" />
    </nav>
  );
};

const Item = ({ label, href }: { label: string; href: Route }) => {
  const pathname = usePathname();

  return (
    <Link
      replace={true}
      className="block border-b border-stone-200 px-6 py-6 hover:bg-stone-100 data-[active=true]:font-medium data-[active=true]:text-black lg:-mx-4 lg:rounded-xl lg:border-none lg:px-4 lg:py-3 lg:text-stone-500 lg:first-of-type:not-[:has(~a[data-active=true])]:font-medium lg:first-of-type:not-[:has(~a[data-active=true])]:text-black dark:border-stone-800 dark:text-white dark:hover:bg-stone-900 dark:data-[active=true]:text-white dark:lg:text-stone-500 dark:lg:first-of-type:not-[:has(~a[data-active=true])]:text-white"
      data-active={href === pathname}
      href={href}
    >
      {label}
    </Link>
  );
};

export { Navigation };
