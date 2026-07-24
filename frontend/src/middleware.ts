import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // Protected dashboard routes
  const isDashboardRoute =
    pathname === "/" ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/stock") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/users") ||
    pathname.startsWith("/broadcast") ||
    pathname.startsWith("/settings");

  if (isDashboardRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && token) {
    const dashboardUrl = new URL("/", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
