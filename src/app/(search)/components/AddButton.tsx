import type { Route } from "next";
import NextLink from "next/link";

const AddButton = <T extends string>({ href }: { href: Route<T> | URL }) => {
  return (
    <div className="sticky bottom-0 z-50 flex">
      <NextLink className="m-4 ml-auto inline-block" href={href as Route}>
        <div className="rounded-full bg-lime-300 p-4 text-black shadow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </NextLink>
    </div>
  );
};

export { AddButton };
