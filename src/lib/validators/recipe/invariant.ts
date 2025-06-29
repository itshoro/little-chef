import { RecipeInvariantError } from "./invariant-error";

function invariant(
  condition: unknown,
  message: string,
  options?: ErrorOptions,
): asserts condition {
  if (!condition) throw new RecipeInvariantError(message, options);
}

export { invariant };
