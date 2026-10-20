import { NextResponse, type NextRequest } from "next/server";
import { APP_SLUGS, STORE_LINKS, type AppSlug } from "./app/lib/storeLinks";
import { storeRedirectTarget } from "./app/lib/appRedirect";

// Business-card QR codes: /apps/user and /apps/vendor.
// iOS / Android → 302 to the store; everything else falls through to the fallback page.
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2] as AppSlug;
  const app = APP_SLUGS[slug];
  const target = app ? storeRedirectTarget(request.headers.get("user-agent"), STORE_LINKS[app]) : null;

  if (!target) {
    const response = NextResponse.next();
    response.headers.set("Vary", "User-Agent");
    return response;
  }

  const response = NextResponse.redirect(target, 302);
  // Platform-specific: must never be reused for another device
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Vary", "User-Agent");
  return response;
}

export const config = {
  matcher: ["/apps/user", "/apps/vendor"],
};
