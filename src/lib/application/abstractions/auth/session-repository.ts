import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";
import { Session } from "../../../domain/auth/session";

export interface SessionRepository {
  create(dto: Session): Promise<Result<Session>>;
  findById(id: string): Promise<Result<Session>>;
  updateLastVerifiedAt(id: string, date: Date): Promise<Result<void>>;
  deleteById(id: string): Promise<Result<void>>;
  deleteByUser(user: User): Promise<Result<void>>;
}
