import type {
  CollectionIdentifier,
  RecipeIdentifier,
  UserIdentifier,
} from "@/drizzle/schema";
import { ServiceError } from "../service-error";

type ResourceMap = {
  recipe: {
    name: "recipe";
    identifier: RecipeIdentifier;
    user: UserIdentifier | undefined;
  };
  collection: {
    name: "collection";
    identifier: CollectionIdentifier;
    user: UserIdentifier | undefined;
  };
  user: {
    name: "user";
    identifier: UserIdentifier;
    user: UserIdentifier | undefined;
  };
};

type ResourceType = keyof ResourceMap;

class UnauthorizedError<T extends ResourceType> extends ServiceError {
  constructor(resource: ResourceMap[T], reason?: string) {
    super(`You are not authorized to interact with this resource.`, 403, {
      cause: { resource, reason },
    });
    this.name = "UnauthorizedError";
  }
}

export { UnauthorizedError };
