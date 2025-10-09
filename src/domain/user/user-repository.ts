import type { Username } from "@/domain/user/credentials";
import type {
  User,
  CreateUserParams as InternalCreateUserParams,
} from "./user";

export type CreateUserParams = Omit<InternalCreateUserParams, "id">;

export interface UserRepository {
  create(dto: CreateUserParams): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByPublicId(id: string): Promise<User | null>;
  findByUsername(username: Username): Promise<User | null>;
}
