export interface SessionTokenProvider {
  getSessionToken(): Promise<string | null>;
  storeSessionToken(token: string): Promise<void>;
}
