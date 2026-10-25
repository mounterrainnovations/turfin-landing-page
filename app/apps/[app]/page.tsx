import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import StoreButtons from "../../components/StoreButtons";
import { APP_NAMES, APP_SLUGS, type AppSlug } from "../../lib/storeLinks";

// Fallback for QR scans that proxy.ts couldn't route to a store (desktop, iPadOS, unknown UA)
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(APP_SLUGS).map((app) => ({ app }));
}

type Props = { params: Promise<{ app: AppSlug }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { app } = await params;
  return { title: `Get ${APP_NAMES[APP_SLUGS[app]]}` };
}

export default async function GetAppPage({ params }: Props) {
  const { app } = await params;
  const key = APP_SLUGS[app];
  const name = APP_NAMES[key];

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-4 py-16 text-center bg-night">
      <Link href="/" className="flex items-center gap-2.5 mb-10" aria-label="Turfin App home">
        <Image src="/turfinLogo.png" alt="" width={82} height={44} className="object-contain h-11 w-auto" priority />
        <span className="text-chalk font-extrabold tracking-tight text-2xl leading-none">
          Turfin <span className="text-lime">App</span>
        </span>
      </Link>

      <h1 className="text-chalk text-4xl md:text-5xl font-extrabold tracking-tight mb-3">Get {name}</h1>
      <p className="text-moss text-base md:text-lg mb-8 max-w-[34ch]">
        {key === "vendor" ? "Manage your venue, slots, and bookings." : "Find, book, and pay for turfs in real time."}
      </p>

      <StoreButtons app={key} className="justify-center" />
    </main>
  );
}
