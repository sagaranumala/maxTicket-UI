import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

//future use for route protection
export function proxy(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  const url = req.nextUrl.clone();

  // Protected routes
  const protectedRoutes = ["/events", "/book", "/dashboard"];
  const isProtected = protectedRoutes.some((path) => url.pathname.startsWith(path));

  if (!token && isProtected) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (token && (url.pathname === "/auth/login" || url.pathname === "/auth/register")) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/events/:path*", "/book/:path*", "/dashboard/:path*", "/auth/login", "/auth/register"],
};
