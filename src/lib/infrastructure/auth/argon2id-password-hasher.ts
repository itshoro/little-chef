import { PasswordHasher } from "@/lib/application/abstractions/auth/password-hasher";
import type { Result } from "@/lib/domain/shared/result";
import type { Password } from "@/lib/domain/user/credentials";
import { hash, verify } from "@node-rs/argon2";

export class Argon2IDPasswordHasher extends PasswordHasher {
  async hash(raw: Password): Promise<Result<string>> {
    try {
      const hashed = await hash(raw);
      return { ok: true, value: hashed };
    } catch {
      return { ok: false, error: new Error("Failed to hash password.") };
    }
  }
  async verify(raw: Password, hashed: string): Promise<Result<void>> {
    try {
      const result = await verify(hashed, raw);
      if (!result) {
        return {
          ok: false,
          error: new Error("Password does not match."),
        };
      }

      return { ok: true, value: undefined };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to verify password.", { cause: e }),
      };
    }
  }
}
