import { routing } from "@/i18n/routing";
import { verifyToken } from "@/lib/auth";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const match = pathname.match(/^\/([a-zA-Z-]+)\//);
  const locale = match ? match[1] : undefined;

  if (pathname === `/${locale}/admin/login`) {
    const token = request.cookies.get("token")?.value;
    if (token) {
      const isValid = verifyToken(token);
      if (isValid) {
        return NextResponse.redirect(
          new URL(`/${locale}/admin/dashboard`, request.url)
        );
      }
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)", "/:locale/admin/:path*"],
};
