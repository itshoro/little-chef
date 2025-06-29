import type { CollectionIdentifier } from "@/drizzle/schema";
import { ResourceNotFoundError } from "./error";

class CollectionNotFoundError extends ResourceNotFoundError {
  public constructor(identifier: CollectionIdentifier) {
    super("Collection", identifier);
    this.name = "CollectionNotFoundError";
  }
}

export { CollectionNotFoundError };
