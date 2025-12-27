import type { SessionTokenProvider } from "@/lib/application/abstractions/auth/session-token-provider";
import type { Result } from "@/lib/domain/shared/result";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "./constants";

export class StatefulSessionTokenProvider implements SessionTokenProvider {
  async storeSessionToken(token: string): Promise<Result<void>> {
    try {
      const jar = await cookies();
      jar.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 10, // 10 days,
        value: token,
        sameSite: "lax",
      });

      return { ok: true, value: undefined };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to store session token in cookie.", {
          cause: e,
        }),
      };
    }
  }

  async getSessionToken(): Promise<Result<string>> {
    try {
      const jar = await cookies();
      const cookie = jar.get(SESSION_COOKIE_NAME);

      const sessionToken = cookie?.value;
      if (!sessionToken) {
        return {
          ok: false,
          error: new Error("No session token found in cookies."),
        };
      }

      return { ok: true, value: sessionToken };
    } catch (e) {
      return {
        ok: false,
        error: new Error("Failed to get session token from cookie.", {
          cause: e,
        }),
      };
    }
  }
}
