import type { AppSlug } from "./storeLinks";

export type QrScan = {
  app: AppSlug;
  platform: "ios" | "android" | "fallback";
  source: string | null;
};

/**
 * Records one approximate QR scan in Supabase (`qr_scans`). No IP, UA or other personal data.
 * Never throws: the redirect must not depend on analytics. Supabase is imported lazily because
 * app/lib/supabase throws at load time when its env vars are missing.
 */
export async function recordScan(scan: QrScan): Promise<void> {
  try {
    const { supabaseAdmin } = await import("./supabase");
    const { error } = await supabaseAdmin.from("qr_scans").insert(scan);
    if (error) throw error;
  } catch (error) {
    console.error("[QR] Failed to record scan:", error);
  }
}
