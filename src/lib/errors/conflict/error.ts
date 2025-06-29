import { ServiceError } from "../service-error";

class ConflictError extends ServiceError {
  constructor(message: string) {
    super(message, 409);
    this.name = "ConflictError";
  }
}

export { ConflictError };
