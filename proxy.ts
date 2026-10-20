import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { APP_SLUGS, APPLE_PROVIDER_TOKEN, STORE_LINKS, type AppSlug } from "./app/lib/storeLinks";
import { detectPlatform, isBot, sanitizeSource, storeRedirectTarget } from "./app/lib/appRedirect";
import { recordScan } from "./app/lib/qrScans";

// Business-card QR codes: /apps/user and /apps/vendor (optionally ?src=<tag>, e.g. ?src=card).
// iOS / Android → 302 to the store; everything else falls through to the fallback page.
export function proxy(request: NextRequest, event: NextFetchEvent) {
  const slug = request.nextUrl.pathname.split("/")[2] as AppSlug;
  const app = APP_SLUGS[slug];
  const userAgent = request.headers.get("user-agent");
  const source = sanitizeSource(request.nextUrl.searchParams.get("src"));
  const campaign = { campaign: source ? `qr_${source}` : "qr", appleProviderToken: APPLE_PROVIDER_TOKEN };
  const target = app ? storeRedirectTarget(userAgent, STORE_LINKS[app], campaign) : null;

  // Approximate scan count — runs after the response is sent; skips bots and browser prefetches
  const prefetch = /prefetch|prerender/i.test(request.headers.get("sec-purpose") ?? request.headers.get("purpose") ?? "");
  if (app && request.method === "GET" && !isBot(userAgent) && !prefetch) {
    const platform = target ? detectPlatform(userAgent) : null;
    event.waitUntil(recordScan({ app: slug, platform: platform ?? "fallback", source }));
  }

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
