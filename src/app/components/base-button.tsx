import { Route } from "next";
import Link, { type LinkProps } from "next/link";

const BaseButton = (
  props:
    | React.ComponentProps<"button">
    | (LinkProps<Route> & { className?: string }),
) => {
  if (isAnchor(props)) {
    return (
      <Link
        {...props}
        className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-lime-300 px-4 py-3 font-medium text-black ${props.className}`}
      />
    );
  } else {
    return (
      <button
        {...props}
        className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-lime-300 px-4 py-3 font-medium text-black ${props.className}`}
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
