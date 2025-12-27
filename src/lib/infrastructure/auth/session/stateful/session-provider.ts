import { SessionProvider } from "@/lib/application/abstractions/auth/session-provider";
import type { SessionRepository } from "@/lib/application/abstractions/auth/session-repository";
import type { SessionTokenProvider } from "@/lib/application/abstractions/auth/session-token-provider";
import type { Session } from "@/lib/domain/auth/session";
import type { Result } from "@/lib/domain/shared/result";
import type { User } from "@/lib/domain/user/user";

export const INACTIVITY_TIMEOUT_MS = 1000 * 60 * 60 * 24 * 10; // 10 days
export const ACTIVITY_UPDATE_INTERVAL_MS = 1000 * 60 * 60; // 1 hour

export class StatefulSessionProvider implements SessionProvider {
  constructor(
    private readonly sessionTokenProvider: SessionTokenProvider,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async getSession(): Promise<Result<Session>> {
    const tokenRes = await this.sessionTokenProvider.getSessionToken();
    if (!tokenRes.ok) return tokenRes;

    const [id, secret] = tokenRes.value.split(".");
    if (!id || !secret) {
      return { ok: false, error: new Error("Unrecognized token format.") };
    }

    const sessionRes = await this.sessionRepository.findById(id);
    if (!sessionRes.ok) return sessionRes;
    const session = sessionRes.value;

    const hasMatchingSecret = this.constantTimeEqual(
      await this.hashSecret(secret),
      session.secretHash,
    );
    if (!hasMatchingSecret) {
      return { ok: false, error: new Error("Invalid session token.") };
    }

    return { ok: true, value: session };
  }

  async createSession(
    user: User,
    now: Date = new Date(),
  ): Promise<Result<Session>> {
    const id = this.generateSecureRandomString();
    const secret = this.generateSecureRandomString();
    const secretHash = await this.hashSecret(secret);

    const sessionRes = await this.sessionRepository.create({
      id,
      userId: user.id,
      secretHash,
      createdAt: now,
      lastVerifiedAt: now,
    });
    if (!sessionRes.ok) return sessionRes;

    const token = `${id}.${secret}`;
    const storeRes = await this.sessionTokenProvider.storeSessionToken(token);
    if (!storeRes) return storeRes;

    return sessionRes;
  }

  async invalidateSession(sessionId: string): Promise<Result<void>> {
    return await this.sessionRepository.deleteById(sessionId);
  }

  async invalidateAllSessionsForUser(user: User): Promise<Result<void>> {
    return await this.sessionRepository.deleteByUser(user);
  }

  async updateLastVerifiedAt(
    sessionId: string,
    now: Date,
  ): Promise<Result<void>> {
    return await this.sessionRepository.updateLastVerifiedAt(sessionId, now);
  }

  private generateSecureRandomString(
    byteLength = 24,
    alphabet = "abcdefghijkmnpqrstuvwxyz23456789",
  ): string {
    // Generate 24 bytes = 192 bits of entropy.
    const bytes = new Uint8Array(byteLength);
    crypto.getRandomValues(bytes);

    let id = "";
    for (let i = 0; i < bytes.length; i++) {
      id += alphabet[(bytes[i] as number) % alphabet.length];
    }
    return id;
  }

  private constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.byteLength !== b.byteLength) {
      return false;
    }
    let c = 0;
    for (let i = 0; i < a.byteLength; i++) {
      c |= (a[i] as number) ^ (b[i] as number);
    }
    return c === 0;
  }

  private async hashSecret(secret: string): Promise<Uint8Array> {
    const secretBytes = new TextEncoder().encode(secret);
    const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
    return new Uint8Array(secretHashBuffer);
  }
}
