import type { Password } from "./credentials";

export abstract class PasswordHasher {
  abstract hash(raw: Password): Promise<string>;
  abstract verify(raw: Password, hashed: string): Promise<boolean>;
}
