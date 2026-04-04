import { NextRequest, NextResponse } from "next/server";

/**
 * Adds security headers to every response.
 * Auth is handled at the API route level (not middleware) to keep it simple.
 */
export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Prevent clickjacking
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
