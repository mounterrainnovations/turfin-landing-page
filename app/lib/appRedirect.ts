// Platform routing for the /apps/* QR codes. Kept dependency-free so it can be unit-tested with node:test.
// User-Agent sniffing is a routing heuristic only — anything uncertain gets the fallback page.

export type Platform = "ios" | "android";

const STORE_HOSTS: Record<Platform, string> = {
  ios: "apps.apple.com",
  android: "play.google.com",
};

// Googlebot-smartphone etc. carry "Android" in their UA; crawlers should see the fallback page
const BOT_RE = /bot|crawl|spider|slurp|preview|facebookexternalhit/i;

export function detectPlatform(userAgent: string | null | undefined): Platform | null {
  if (typeof userAgent !== "string" || userAgent.length === 0) return null;
  if (BOT_RE.test(userAgent)) return null;
  // iOS first. iPadOS 13+ Safari reports as "Macintosh", so it falls through to the fallback page.
  if (/\b(iPhone|iPad|iPod)\b/.test(userAgent)) return "ios";
  if (/\bAndroid\b/.test(userAgent)) return "android";
  return null;
}

export function isStoreUrl(url: unknown, platform: Platform): url is string {
  if (typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname === STORE_HOSTS[platform];
  } catch {
    return false;
  }
}

/** Store URL to 302 to, or null to serve the fallback page. Never returns an unvalidated URL. */
export function storeRedirectTarget(
  userAgent: string | null | undefined,
  links: Partial<Record<Platform, string>> | undefined,
): string | null {
  const platform = detectPlatform(userAgent);
  if (!platform || !links) return null;
  const url = links[platform];
  return isStoreUrl(url, platform) ? url : null;
}
