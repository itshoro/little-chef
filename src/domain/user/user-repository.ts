import type { Username } from "@/domain/user/credentials";
import type { User } from "./user";
import type { Result } from "../shared/result";

export interface UserRepository {
  create(dto: Omit<User, "id">): Promise<Result<User, Error>>;
  findById(id: number): Promise<User | null>;
  findByPublicId(id: string): Promise<User | null>;
  findByUsername(username: Username): Promise<User | null>;

  update(user: User): Promise<Result<User, Error>>;
}
