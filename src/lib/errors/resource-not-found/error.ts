import { ServiceError } from "../service-error";

abstract class ResourceNotFoundError extends ServiceError {
  constructor(resourceName: string, identifier: unknown) {
    super(`${resourceName} not found.`, 404, { cause: { identifier } });
    this.name = "ResourceNotFoundError";
  }
}

export { ResourceNotFoundError };
