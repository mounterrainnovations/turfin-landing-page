// Run: npm test  (node:test + Node's built-in TypeScript stripping, no extra deps)
import { test } from "node:test";
import assert from "node:assert/strict";
import { detectPlatform, isStoreUrl, storeRedirectTarget } from "../app/lib/appRedirect.ts";
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

test("crawlers → fallback even with a mobile UA", () => {
  assert.equal(detectPlatform(UA.googlebotMobile), null);
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
