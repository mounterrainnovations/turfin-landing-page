// Run: npm test  (node:test + Node's built-in TypeScript stripping, no extra deps)
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  detectPlatform,
  isBot,
  isStoreUrl,
  sanitizeSource,
  storeRedirectTarget,
  withCampaign,
} from "../app/lib/appRedirect.ts";
import { APP_SLUGS, STORE_LINKS } from "../app/lib/storeLinks.ts";

const UA = {
  iphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
  iphoneChrome:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/138.0.7204.156 Mobile/15E148 Safari/604.1",
  ipod: "Mozilla/5.0 (iPod touch; CPU iPhone OS 15_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1",
  ipadLegacy:
    "Mozilla/5.0 (iPad; CPU OS 12_5_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1",
  ipadOS:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15",
  android:
    "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36",
  androidLens:
    "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/138.0.0.0 Mobile Safari/537.36 GSA/15.0",
  macChrome:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
  windows:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0",
  linux: "Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0",
  googlebotMobile:
    "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  whatsappPreview: "WhatsApp/2.24.21.80 A",
  curl: "curl/8.7.1",
};

const links = STORE_LINKS.player;

test("iPhone (Safari and Chrome) → App Store", () => {
  assert.equal(storeRedirectTarget(UA.iphone, links), links.ios);
  assert.equal(storeRedirectTarget(UA.iphoneChrome, links), links.ios);
});

test("iPod / legacy iPad UA → App Store", () => {
  assert.equal(storeRedirectTarget(UA.ipod, links), links.ios);
  assert.equal(storeRedirectTarget(UA.ipadLegacy, links), links.ios);
});

test("iPadOS desktop-class UA (looks like a Mac) → fallback, not guessed", () => {
  assert.equal(storeRedirectTarget(UA.ipadOS, links), null);
});

test("Android → Google Play", () => {
  assert.equal(storeRedirectTarget(UA.android, links), links.android);
  assert.equal(storeRedirectTarget(UA.androidLens, links), links.android);
});

test("desktop → fallback", () => {
  for (const ua of [UA.macChrome, UA.windows, UA.linux]) assert.equal(storeRedirectTarget(ua, links), null);
});

test("missing, unknown, malformed UA → fallback", () => {
  for (const ua of [undefined, null, "", UA.curl, "%%%\u0000<script>", "android", "IPHONE-ish", 42]) {
    assert.equal(storeRedirectTarget(ua, links), null, String(ua));
  }
});

test("crawlers and link previewers → fallback even with a mobile UA", () => {
  assert.equal(detectPlatform(UA.googlebotMobile), null);
  assert.equal(detectPlatform(UA.whatsappPreview), null);
  assert.ok(isBot(UA.googlebotMobile) && isBot(UA.whatsappPreview));
  assert.ok(!isBot(UA.iphone) && !isBot(UA.android) && !isBot(null));
});

test("missing or invalid store config → fallback, never a placeholder redirect", () => {
  assert.equal(storeRedirectTarget(UA.iphone, undefined), null);
  assert.equal(storeRedirectTarget(UA.iphone, {}), null);
  assert.equal(storeRedirectTarget(UA.iphone, { ios: "" }), null);
  assert.equal(storeRedirectTarget(UA.iphone, { ios: "http://apps.apple.com/app/id1" }), null);
  assert.equal(storeRedirectTarget(UA.iphone, { ios: "https://evil.example/app" }), null);
  assert.equal(storeRedirectTarget(UA.iphone, { ios: "https://apps.apple.com.evil.example/x" }), null);
  // iOS UA must never be sent to a Play URL, and vice versa
  assert.equal(storeRedirectTarget(UA.iphone, { ios: links.android }), null);
  assert.equal(storeRedirectTarget(UA.android, { android: links.ios }), null);
});

test("configured production links are valid HTTPS official-store URLs", () => {
  for (const [app, { ios, android }] of Object.entries(STORE_LINKS)) {
    assert.ok(isStoreUrl(ios, "ios"), `${app}.ios`);
    assert.ok(isStoreUrl(android, "android"), `${app}.android`);
  }
});

test("every QR slug maps to a configured app", () => {
  assert.deepEqual(Object.keys(APP_SLUGS).sort(), ["user", "vendor"]);
  for (const app of Object.values(APP_SLUGS)) assert.ok(STORE_LINKS[app]);
});

test("src tag: short slugs only, lowercased", () => {
  assert.equal(sanitizeSource("card"), "card");
  assert.equal(sanitizeSource("Card_2026"), "card_2026");
  for (const bad of [null, undefined, "", "a b", "x".repeat(25), "https://evil.example", "card&ct=x"]) {
    assert.equal(sanitizeSource(bad), null, String(bad));
  }
});

test("Google Play campaign → referrer UTM, same listing", () => {
  const url = new URL(withCampaign(links.android, "android", { campaign: "qr_card" }));
  assert.equal(url.hostname, "play.google.com");
  assert.equal(url.searchParams.get("id"), "in.mounterra.turfin");
  assert.equal(url.searchParams.get("referrer"), "utm_source=turfinapp&utm_medium=qr&utm_campaign=qr_card");
});

test("App Store campaign → pt/ct only when a provider token is set", () => {
  assert.equal(withCampaign(links.ios, "ios", { campaign: "qr_card" }), links.ios);
  const url = new URL(withCampaign(links.ios, "ios", { campaign: "qr_card", appleProviderToken: "123456" }));
  assert.equal(url.origin + url.pathname, links.ios);
  assert.equal(url.searchParams.get("pt"), "123456");
  assert.equal(url.searchParams.get("ct"), "qr_card");
  assert.equal(url.searchParams.get("mt"), "8");
});

test("tagged redirect still lands on the official store", () => {
  const campaign = { campaign: "qr_card", appleProviderToken: "123456" };
  assert.ok(storeRedirectTarget(UA.iphone, links, campaign).startsWith(links.ios + "?"));
  assert.ok(storeRedirectTarget(UA.android, links, campaign).startsWith(links.android + "&"));
  assert.equal(storeRedirectTarget(UA.macChrome, links, campaign), null);
  assert.equal(storeRedirectTarget(UA.iphone, { ios: "https://evil.example/x" }, campaign), null);
});
