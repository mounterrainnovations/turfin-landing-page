"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Home",     href: "/"          },
  { label: "Features", href: "/#features" },
  { label: "About",    href: "/#about"    },
];

/**
 * On the home page, section links are plain in-page anchors so Lenis can smooth-scroll to them.
 * From any other page they navigate home to that section.
 */
function NavLink({ href, onHome, ...props }: { href: string; onHome: boolean } & Omit<React.ComponentProps<"a">, "href">) {
  const hash = href.split("#")[1];
  if (onHome && hash) return <a href={`#${hash}`} {...props} />;
  return <Link href={href} {...props} />;
}

export default function Navbar() {
  const onHome = usePathname() === "/";
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      // Tuck the bar away while reading down the page, bring it back on the way up
      if (y <= 400 || y < lastY.current - 4) setHidden(false);
      else if (y > lastY.current + 4) setHidden(true);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-out-expo border-b ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${scrolled ? "bg-night/80 backdrop-blur-xl border-chalk/10" : "bg-transparent border-transparent"}`}
    >
      <div className="flex items-center justify-between gap-4 px-5 md:px-10 h-16 md:h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group flex-none" aria-label="Turfin App home">
          <Image
            src="/turfinLogo.png"
            alt=""
            width={56}
            height={30}
            className="object-contain h-[30px] w-auto transition-transform duration-500 ease-out-expo group-hover:scale-105"
          />
          <span className="text-chalk font-extrabold tracking-tight text-lg leading-none">
            Turfin <span className="text-lime">App</span>
          </span>
        </Link>

        {/* Centre links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => {
            return (
              <NavLink
                key={label}
                href={href}
                onHome={onHome}
                className="group relative px-3.5 py-2 text-sm font-medium text-chalk/65 hover:text-chalk transition-colors duration-300"
              >
                {label}
                <span className="absolute left-3.5 right-3.5 bottom-1 h-px bg-lime origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out-expo" />
              </NavLink>
            );
          })}
        </div>

        {/* CTA */}
        <NavLink
          href="/#download"
          onHome={onHome}
          className="group flex items-center gap-2 h-10 pl-4 pr-1.5 rounded-full bg-lime text-night text-sm font-semibold whitespace-nowrap flex-none transition-colors duration-300 hover:bg-chalk"
        >
          Get the app
          <span className="w-7 h-7 rounded-full bg-night text-lime flex items-center justify-center overflow-hidden">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden className="transition-transform duration-500 ease-out-expo group-hover:-rotate-45">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </NavLink>
      </div>
    </nav>
  );
}
