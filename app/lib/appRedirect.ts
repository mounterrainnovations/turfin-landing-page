// Platform routing for the /apps/* QR codes. Kept dependency-free so it can be unit-tested with node:test.
// User-Agent sniffing is a routing heuristic only — anything uncertain gets the fallback page.

export type Platform = "ios" | "android";

const STORE_HOSTS: Record<Platform, string> = {
  ios: "apps.apple.com",
  android: "play.google.com",
};

// Crawlers and chat link-preview fetchers (Googlebot-smartphone carries "Android" in its UA).
// They get the fallback page and are not counted as scans.
const BOT_RE = /bot|crawl|spider|slurp|preview|facebookexternalhit|^WhatsApp\//i;

export function isBot(userAgent: string | null | undefined): boolean {
  return typeof userAgent === "string" && BOT_RE.test(userAgent);
}

export function detectPlatform(userAgent: string | null | undefined): Platform | null {
  if (typeof userAgent !== "string" || userAgent.length === 0) return null;
  if (isBot(userAgent)) return null;
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

/** `?src=` tag printed on a QR (e.g. "card"). Anything that isn't a short slug is dropped. */
export function sanitizeSource(value: string | null | undefined): string | null {
  return typeof value === "string" && /^[a-z0-9_-]{1,24}$/i.test(value) ? value.toLowerCase() : null;
}

export type CampaignOptions = {
  /** Campaign name shown in App Store Connect / Play Console, e.g. "qr_card" */
  campaign: string;
  /** App Store Connect provider token — Apple ignores `ct` without it */
  appleProviderToken?: string | null;
};

/** Adds store-native campaign attribution: Apple `pt`/`ct`, Google Play `referrer` UTM. */
export function withCampaign(url: string, platform: Platform, { campaign, appleProviderToken }: CampaignOptions): string {
  const tagged = new URL(url);
  if (platform === "ios") {
    if (!appleProviderToken) return url;
    tagged.searchParams.set("pt", appleProviderToken);
    tagged.searchParams.set("ct", campaign);
    tagged.searchParams.set("mt", "8");
  } else {
    tagged.searchParams.set(
      "referrer",
      new URLSearchParams({ utm_source: "turfinapp", utm_medium: "qr", utm_campaign: campaign }).toString(),
    );
  }
  return tagged.toString();
}

/** Store URL to 302 to, or null to serve the fallback page. Never returns an unvalidated URL. */
export function storeRedirectTarget(
  userAgent: string | null | undefined,
  links: Partial<Record<Platform, string>> | undefined,
  campaign?: CampaignOptions,
): string | null {
  const platform = detectPlatform(userAgent);
  if (!platform || !links) return null;
  const url = links[platform];
  if (!isStoreUrl(url, platform)) return null;
  const target = campaign ? withCampaign(url, platform, campaign) : url;
  return isStoreUrl(target, platform) ? target : null;
}
