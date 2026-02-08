import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /en/... → redirect to /... (strip redundant default prefix)
  if (pathname.startsWith("/en")) {
    const stripped = pathname.replace(/^\/en/, "") || "/";
    const url = request.nextUrl.clone();
    url.pathname = stripped;
    return NextResponse.redirect(url);
  }

  // /fr/... → pass through with locale header
  if (pathname.startsWith("/fr")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-locale", "fr");
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // Everything else → rewrite to /en/... (add default locale internally)
  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname}`;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", "en");
  return NextResponse.rewrite(url, {
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|sitemap.xml|robots.txt|api|admin|logo).*)",
  ],
};
