import type { Result } from "../../../domain/shared/result";
import type { Password } from "../../../domain/user/credentials";

export abstract class PasswordHasher {
  abstract hash(raw: Password): Promise<Result<string>>;
  abstract verify(raw: Password, hashed: string): Promise<Result<void>>;
}
