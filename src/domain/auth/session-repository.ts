import { Session } from "./session";

export abstract class SessionRepository {
  abstract create(dto: Session): Promise<Session>;
  abstract findById(id: string): Promise<Session | null>;
  abstract updateLastVerifiedAt(id: string, date: Date): Promise<void>;
  abstract deleteById(id: string): Promise<void>;
}
