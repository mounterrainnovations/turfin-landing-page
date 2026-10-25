"use client";

import Image from "next/image";
import Link from "next/link";
import { STORE_LINKS } from "./StoreButtons";

const APP_LINKS = [
  { label: "TurfIn",     note: "for players", links: STORE_LINKS.player },
  { label: "TurfIn Ops", note: "for venues",  links: STORE_LINKS.vendor },
];

const FOOTER_LINKS = [
  { label: "Privacy",  href: "/privacy"                  },
  { label: "Terms",    href: "/termsandconditions"       },
  { label: "Instagram",href: "https://www.instagram.com/turfinapp?xtok=ZTUyOGFmMnoyaTFz", external: true },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full pt-14 pb-10 border-t border-chalk/10">
      {/* Top row: logo left, links right — stacks on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
        <Link href="/" className="flex items-center gap-2.5 flex-none" aria-label="Turfin App home">
          <Image src="/turfinLogo.png" alt="" width={60} height={32} className="object-contain h-8 w-auto" />
          <span className="text-chalk font-extrabold tracking-tight text-xl leading-none">
            Turfin <span className="text-lime">App</span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
          {FOOTER_LINKS.map(({ label, href, external }) => (
            <Link
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="text-moss hover:text-chalk text-sm transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* App downloads */}
      <div className="grid sm:grid-cols-3 gap-6 sm:gap-12 mb-12 pb-12 border-b border-chalk/10">
        {APP_LINKS.map(({ label, note, links }) => (
          <div key={label}>
            <p className="text-chalk text-sm font-semibold">
              {label} <span className="text-moss font-normal">{note}</span>
            </p>
            <div className="flex gap-5 mt-2.5">
              <a href={links.ios} target="_blank" rel="noopener noreferrer" className="text-moss hover:text-lime text-sm transition-colors duration-200">
                App Store
              </a>
              <a href={links.android} target="_blank" rel="noopener noreferrer" className="text-moss hover:text-lime text-sm transition-colors duration-200">
                Google Play
              </a>
            </div>
          </div>
        ))}
        <div>
          <p className="text-chalk text-sm font-semibold">
            DPIIT recognised <span className="text-moss font-normal">startup</span>
          </p>
          <a
            href="/dpiit-startup-certificate.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2.5 text-moss hover:text-lime text-sm transition-colors duration-200"
          >
            Certificate no. DIPP270091
          </a>
        </div>
      </div>

      {/* Legal text */}
      <div className="grid md:grid-cols-2 gap-6 md:gap-12">
        <p className="text-moss/70 text-xs leading-relaxed max-w-[68ch]">
          TurfIn is a product of RE Orbit Innovations Pvt. Ltd. © {currentYear}. TurfIn is not a venue operator,
          property owner, or sports facility. TurfIn facilitates bookings between users and independent venue
          partners. All bookings, payments, and cancellation terms are governed by venue policies shown clearly
          before confirmation. TurfIn is not liable for venue availability, quality, or disputes. Powering the
          next gen of play.
        </p>
        <p className="text-moss/55 text-xs leading-relaxed max-w-[68ch]">
          App availability, features, and pricing are subject to change. TurfCoins are a loyalty reward and
          hold no monetary value. This website is intended for users in India and select international markets.
        </p>
      </div>
    </footer>
  );
}
