import type { Result } from "@/lib/domain/shared/result";

export interface SessionTokenProvider {
  getSessionToken(): Promise<Result<string>>;
  storeSessionToken(token: string): Promise<Result<void>>;
}
