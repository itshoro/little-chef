import { redirect, RedirectType } from "next/navigation";
import { validateSession } from "./validate-session";
import type { Route } from "next";

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

export function redirectToSignIn(returnPath: Route): never {
  const url = [
    "/login" satisfies Route,
    new URLSearchParams({ returnTo: returnPath }),
  ].join("?") as Route;

  redirect(url, RedirectType.replace);
}
