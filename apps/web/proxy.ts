import { NextResponse } from "next/server";

import { isAppHost } from "@/lib/host/is-app-host";
import { marketingUrl } from "@/lib/host/urls";

import type { NextRequest } from "next/server";

const APP_ROUTE_PREFIX = "/app";
const SITE_ROUTE_PREFIX = "/site";

const SITE_ONLY_PATHS = ["/login", "/register"];

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico)$/.test(pathname)
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  const onAppHost = isAppHost(request.headers.get("host"));

  if (
    onAppHost &&
    SITE_ONLY_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
  ) {
    return NextResponse.redirect(marketingUrl(pathname));
  }

  if (onAppHost) {
    if (pathname.startsWith(APP_ROUTE_PREFIX)) {
      return NextResponse.next();
    }

    const url = request.nextUrl.clone();
    url.pathname =
      pathname === "/" ? APP_ROUTE_PREFIX : `${APP_ROUTE_PREFIX}${pathname}`;
    return NextResponse.rewrite(url);
  }

  if (pathname.startsWith(SITE_ROUTE_PREFIX)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname =
    pathname === "/" ? SITE_ROUTE_PREFIX : `${SITE_ROUTE_PREFIX}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
