import { NextRequest, NextResponse } from "next/server";

async function middleware(request: NextRequest) {
  if (request.method === "GET") {
    // extend session life time on get because we can be certain a new session hasn't been established.
    const response = NextResponse.next({
      headers: new Headers([["x-current-path", request.nextUrl.pathname]]),
    });
    const sessionToken = request.cookies.get("session")?.value ?? null;

    if (sessionToken !== null) {
      response.cookies.set("session", sessionToken, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    }

    return response;
  }

  const origin = request.headers.get("Origin");
  const host = request.headers.get("Host");

  if (origin === null || host === null) {
    return new NextResponse(null, {
      status: 403,
    });
  }

  const originUrl = URL.parse(origin);
  if (originUrl === null) {
    return new NextResponse(null, {
      status: 403,
    });
  }
  if (originUrl.host !== host) {
    return new NextResponse(null, {
      status: 403,
    });
  }

  return NextResponse.next({
    headers: new Headers([["x-current-path", request.nextUrl.pathname]]),
  });
}

export { middleware };
