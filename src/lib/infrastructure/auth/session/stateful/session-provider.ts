import { SessionProvider } from "@/lib/application/abstractions/auth/session-provider";
import type { SessionRepository } from "@/lib/application/abstractions/auth/session-repository";
import type { SessionTokenProvider } from "@/lib/application/abstractions/auth/session-token-provider";
import type { User } from "@/lib/domain/user/user";

export const INACTIVITY_TIMEOUT_MS = 1000 * 60 * 60 * 24 * 10; // 10 days
export const ACTIVITY_UPDATE_INTERVAL_MS = 1000 * 60 * 60; // 1 hour

export class StatefulSessionProvider implements SessionProvider {
  constructor(
    private readonly sessionTokenProvider: SessionTokenProvider,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async getSession() {
    const token = await this.sessionTokenProvider.getSessionToken();
    if (!token) return null;

    const [id, secret] = token.split(".");
    if (!id || !secret) return null;

    const session = await this.sessionRepository.findById(id);
    if (!session) return null;

    const hasMatchingSecret = this.constantTimeEqual(
      await this.hashSecret(secret),
      session.secretHash,
    );
    if (!hasMatchingSecret) return null;

    return session;
  }

  async createSession(user: User, now: Date = new Date()) {
    const id = this.generateSecureRandomString();
    const secret = this.generateSecureRandomString();
    const secretHash = await this.hashSecret(secret);

    const session = await this.sessionRepository.create({
      id,
      userId: user.id,
      secretHash,
      createdAt: now,
      lastVerifiedAt: now,
    });

    const token = `${id}.${secret}`;
    await this.sessionTokenProvider.storeSessionToken(token);

    return session;
  }

  async invalidateSession(sessionId: string): Promise<void> {
    await this.sessionRepository.deleteById(sessionId);
  }

  async invalidateAllSessionsForUser(user: User): Promise<void> {
    await this.sessionRepository.deleteByUser(user);
  }

  async updateLastVerifiedAt(sessionId: string, now: Date): Promise<void> {
    await this.sessionRepository.updateLastVerifiedAt(sessionId, now);
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
      id += alphabet[bytes[i] % alphabet.length];
    }
    return id;
  }

  private constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.byteLength !== b.byteLength) {
      return false;
    }
    let c = 0;
    for (let i = 0; i < a.byteLength; i++) {
      c |= a[i] ^ b[i];
    }
    return c === 0;
  }

  private async hashSecret(secret: string): Promise<Uint8Array> {
    const secretBytes = new TextEncoder().encode(secret);
    const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
    return new Uint8Array(secretHashBuffer);
  }
}
