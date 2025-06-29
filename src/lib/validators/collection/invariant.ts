import { CollectionInvariantError } from "./invariant-error";

function invariant(
  condition: unknown,
  message: string,
  options?: ErrorOptions,
): asserts condition {
  if (!condition) throw new CollectionInvariantError(message, options);
}

export { invariant };
