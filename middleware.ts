import { NextResponse, type NextRequest } from "next/server";

/**
 * Exposes the request pathname to server components as `x-pathname`.
 *
 * The root layout renders the single `<html>` element for every route but
 * receives no params, so it could not know which locale was being served and
 * hardcoded `lang="en"`. That was corrected after hydration by an inline
 * script, which meant the SERVER-rendered HTML — the version crawlers and
 * non-JS consumers parse — declared the Portuguese, Spanish and French pages
 * as English. Passing the path through lets the layout set the right value
 * server-side.
 */
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  // Pages only. Skipping _next assets, the API and anything with a file
  // extension keeps this off the hot path for static requests.
  matcher: ["/((?!api|_next/static|_next/image|.*\\.).*)"],
};
