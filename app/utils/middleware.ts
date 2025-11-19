import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Route protection middleware
export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const url = req.nextUrl.clone();

  const protectedRoutes = ["/events", "/book", "/dashboard"];
  const isProtected = protectedRoutes.some((path) =>
    url.pathname.startsWith(path)
  );

  // Not logged in & trying to access protected page
  if (!token && isProtected) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Logged in & trying to access login/register
  if (
    token &&
    (url.pathname === "/auth/login" || url.pathname === "/auth/register")
  ) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/events/:path*",
    "/book/:path*",
    "/dashboard/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
