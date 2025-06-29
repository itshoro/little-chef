import { AuthorizationInvariantError } from "./invariant-error";

function invariant(
  condition: unknown,
  message: string,
  options?: ErrorOptions,
): asserts condition {
  if (!condition) throw new AuthorizationInvariantError(message, options);
}

export { invariant };
