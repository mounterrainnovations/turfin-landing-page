"use client";

import Image from "next/image";
import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Privacy",  href: "/privacy"                  },
  { label: "Terms",    href: "/termsandconditions"       },
  { label: "Twitter",  href: "https://twitter.com",   external: true },
  { label: "Instagram",href: "https://instagram.com", external: true },
  { label: "Discord",  href: "https://discord.com",   external: true },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-16 pb-10 border-t border-white/5">
      {/* Top row: logo left, links right — stacks on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
        <Link href="/" className="flex items-center gap-2.5 flex-none">
          <Image src="/turfinLogo.svg" alt="TurfInApp" width={36} height={36} className="object-contain" />
          <span className="text-white font-extrabold tracking-tighter text-xl leading-none">
            TurfIn<span className="text-[#CCFF00]">App.</span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {FOOTER_LINKS.map(({ label, href, external }) => (
            <Link
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="text-white/40 hover:text-white text-sm transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Legal text */}
      <div className="space-y-3 max-w-4xl">
        <p className="text-white/20 text-xs leading-relaxed">
          TurfIn is a product of RE Orbit Innovations Pvt. Ltd. © {currentYear}. TurfIn is not a venue operator,
          property owner, or sports facility. TurfIn facilitates bookings between users and independent venue
          partners. All bookings, payments, and cancellation terms are governed by venue policies shown clearly
          before confirmation. TurfIn is not liable for venue availability, quality, or disputes. Powering the
          next gen of play.
        </p>
        <p className="text-white/15 text-xs leading-relaxed">
          App availability, features, and pricing are subject to change. TurfCoins are a loyalty reward and
          hold no monetary value. Early access benefits are extended to waitlist members at TurfIn&apos;s
          discretion. This website is intended for users in India and select international markets.
        </p>
      </div>
    </footer>
  );
}
