import { ServiceError } from "../service-error";

class UnauthenticatedError extends ServiceError {
  constructor() {
    super(`You need to be authenticated to interact with this resource.`, 401);
    this.name = "UnauthenticatedError";
  }
}

export { UnauthenticatedError };
