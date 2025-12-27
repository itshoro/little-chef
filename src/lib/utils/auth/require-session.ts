import type { Route } from "next";
import { redirect, RedirectType } from "next/navigation";
import { validateSession } from "./validate-session";

interface Options {
  onUnauthenticated: () => never;
}

export async function requireSession(options: Options) {
  const validationResult = await validateSession();

  if (!validationResult.session) {
    options.onUnauthenticated();
  }

  return validationResult;
}

export function redirectToSignIn<T extends string = string>(
  returnPath: Route<T>,
): never {
  const url = [
    "/login" satisfies Route<T>,
    new URLSearchParams({ returnTo: returnPath }),
  ].join("?") as Route;

  redirect(url, RedirectType.replace);
}

export function redirectToVerify<T extends string = string>(
  returnPath: Route<T>,
): never {
  const url = [
    "/verify" satisfies Route<T>,
    new URLSearchParams({ redirect: returnPath }),
  ].join("?") as Route;

  redirect(url, RedirectType.replace);
}
