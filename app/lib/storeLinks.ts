// Single source of truth for store listings — used by the landing page, footer,
// and the /apps/* QR redirects. Apple needs /in/ — the apps are only listed in the India storefront.
export const STORE_LINKS = {
  // TurfIn — the player app
  player: {
    ios: "https://apps.apple.com/in/app/id6785032253",
    android: "https://play.google.com/store/apps/details?id=in.mounterra.turfin",
  },
  // TurfIn Ops — the venue / vendor app
  vendor: {
    ios: "https://apps.apple.com/in/app/id6781202778",
    android: "https://play.google.com/store/apps/details?id=com.reorbitals.turfinapp.vendor",
  },
} as const;

export type AppKey = keyof typeof STORE_LINKS;

// App Store Connect provider token for campaign links (public — it appears in every campaign URL).
// App Store Connect → Apps → App Analytics → Acquisition → Campaigns → Generate Campaign Link → the `pt=` value.
// Until set, iOS redirects go out untagged; Google Play attribution works without it.
export const APPLE_PROVIDER_TOKEN: string | null = null;

// Public QR paths (/apps/<slug>) → app. Printed on business cards — do not rename.
export const APP_SLUGS = {
  user: "player",
  vendor: "vendor",
} as const satisfies Record<string, AppKey>;

export type AppSlug = keyof typeof APP_SLUGS;

export const APP_NAMES: Record<AppKey, string> = {
  player: "TurfIn",
  vendor: "TurfIn Ops",
};
