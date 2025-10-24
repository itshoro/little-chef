import type { Password } from "@/lib/domain/user/credentials";
import { PasswordHasher } from "@/lib/domain/user/password-hasher";
import { hash, verify } from "@node-rs/argon2";

export class Argon2IDPasswordHasher extends PasswordHasher {
  hash(raw: Password): Promise<string> {
    return hash(raw);
  }
  verify(raw: Password, hashed: string): Promise<boolean> {
    return verify(hashed, raw);
  }
}
