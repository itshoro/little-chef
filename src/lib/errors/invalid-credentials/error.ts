import { ServiceError } from "../service-error";

class InvalidCredentialsError extends ServiceError {
  constructor() {
    super("Invalid username or password.", 401);
    this.name = "InvalidCredentialsError";
  }
}
export { InvalidCredentialsError };
