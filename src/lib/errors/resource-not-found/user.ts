import type { UserIdentifier } from "@/drizzle/schema";
import type { Username } from "@/lib/validators/user";
import { ResourceNotFoundError } from "./error";

class UserNotFoundError extends ResourceNotFoundError {
  public constructor(identifier: UserIdentifier | { username: Username }) {
    super("User", identifier);
    this.name = "UserNotFoundError";
  }
}

export { UserNotFoundError };
