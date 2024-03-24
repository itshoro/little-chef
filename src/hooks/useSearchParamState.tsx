import {
  usePathname,
  useSearchParams,
  useRouter,
  type ReadonlyURLSearchParams,
} from "next/navigation";

type SearchParamStateUpdate =
  | string
  | null
  | ((currentValue: string | null) => string | null);

function useSearchParamState(param: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setState(newParamValue: SearchParamStateUpdate) {
    const newParams = new URLSearchParams(searchParams);

    const value =
      typeof newParamValue === "function"
        ? newParamValue(newParams.get(param))
        : newParamValue;

    newParams.set(param, value ?? "");

    router.push(createUrl(pathname, newParams));
  }

  return [searchParams.get(param), setState] as const;
}

function createUrl(
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams,
) {
  const queryString = params.size > 0 ? `?${params.toString()}` : "";
  return `${pathname}${queryString}`;
}

export { useSearchParamState };
