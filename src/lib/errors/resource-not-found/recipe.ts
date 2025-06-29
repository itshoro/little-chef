import type { RecipeIdentifier } from "@/drizzle/schema";
import { ResourceNotFoundError } from "./error";

class RecipeNotFoundError extends ResourceNotFoundError {
  public constructor(identifier: RecipeIdentifier) {
    super("Recipe", identifier);
    this.name = "RecipeNotFoundError";
  }
}

export { RecipeNotFoundError };
