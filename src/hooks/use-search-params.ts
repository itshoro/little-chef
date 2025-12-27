import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

function useSearchParamState(
  key: string,
  updateStrategy: "replace" | "push" = "replace",
) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const setParam = useCallback(
    (value: string) => {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set(key, value);

      const newQuery = newParams.toString();
      const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;

      window.history[`${updateStrategy}State`](null, "", newUrl);
    },
    [key, searchParams, updateStrategy],
  );

  return [searchParams.get(key), setParam] as const;
}

export { useSearchParamState };
