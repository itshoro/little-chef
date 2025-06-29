import { AuthenticationInvariantError } from "./invariant-error";

function invariant(
  condition: unknown,
  message: string,
  options?: ErrorOptions,
): asserts condition {
  if (!condition) throw new AuthenticationInvariantError(message, options);
}

export { invariant };
