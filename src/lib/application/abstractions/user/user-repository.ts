import type { Username } from "@/lib/domain/user/credentials";
import type { Result } from "../../../domain/shared/result";
import type { User } from "../../../domain/user/user";

export interface UserRepository {
  create(dto: Omit<User, "id">): Promise<Result<User>>;
  findById(id: number): Promise<Result<User>>;
  findByPublicId(id: string): Promise<Result<User>>;
  findByUsername(username: Username): Promise<Result<User>>;

  update(user: User): Promise<Result<User>>;
}
