import { UserInvariantError } from "./invariant-error";

function invariant(
  condition: unknown,
  message: string,
  options?: ErrorOptions,
): asserts condition {
  if (!condition) throw new UserInvariantError(message, options);
}

export { invariant };
