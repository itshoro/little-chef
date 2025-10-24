import type { SessionTokenProvider } from "@/lib/application/abstractions/auth/session-token-provider";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "./constants";

export class StatefulSessionTokenProvider implements SessionTokenProvider {
  async storeSessionToken(token: string): Promise<void> {
    const jar = await cookies();
    jar.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 10, // 10 days,
      value: token,
      sameSite: "lax",
    });
  }

  async getSessionToken() {
    const jar = await cookies();
    const cookie = jar.get(SESSION_COOKIE_NAME);

    return cookie?.value ?? null;
  }
}
