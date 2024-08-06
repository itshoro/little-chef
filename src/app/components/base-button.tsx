import { Route } from "next";
import Link, { type LinkProps } from "next/link";

const BaseButton = (
  props: React.ComponentProps<"button"> | LinkProps<Route>,
) => {
  if (isAnchor(props)) {
    return (
      <Link
        {...props}
        className={
          "inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-4 text-sm font-medium shadow active:bg-neutral-100 active:shadow-inner disabled:pointer-events-none disabled:text-neutral-200 disabled:shadow-none dark:border-stone-700 dark:bg-stone-900 dark:text-white dark:active:bg-stone-700 " +
          props.className
        }
      />
    );
  } else {
    return (
      <button
        {...props}
        className={
          "inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-4 text-sm font-medium shadow active:bg-neutral-100 active:shadow-inner disabled:pointer-events-none disabled:text-neutral-200 disabled:shadow-none dark:border-stone-700 dark:bg-stone-900 dark:text-white dark:active:bg-stone-700 " +
          props.className
        }
      />
    );
  }
};

function isAnchor(
  props: React.ComponentProps<"button"> | LinkProps<Route>,
): props is LinkProps<Route> {
  return "href" in props;
}

export { BaseButton };
