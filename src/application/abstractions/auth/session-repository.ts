import type { User } from "@/domain/user/user";
import { Session } from "../../../domain/auth/session";

export interface SessionRepository {
  create(dto: Session): Promise<Session>;
  findById(id: string): Promise<Session | null>;
  updateLastVerifiedAt(id: string, date: Date): Promise<void>;
  deleteById(id: string): Promise<void>;
  deleteByUser(user: User): Promise<void>;
}
