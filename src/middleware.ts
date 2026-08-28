import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/admin/forgot-password", "/admin/reset-password"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin") && !PUBLIC_ADMIN_PATHS.has(pathname)) {
    if (!request.cookies.get("pawlix_admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
