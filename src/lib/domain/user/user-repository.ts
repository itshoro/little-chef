import type { Username } from "@/lib/domain/user/credentials";
import type { Result } from "../shared/result";
import type { User } from "./user";

export interface UserRepository {
  create(dto: Omit<User, "id">): Promise<Result<User, Error>>;
  findById(id: number): Promise<User | null>;
  findByPublicId(id: string): Promise<User | null>;
  findByUsername(username: Username): Promise<User | null>;

  update(user: User): Promise<Result<User, Error>>;
}
