"use client";

import { useState, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Coins,
  CreditCard,
  Lightning,
  MapPin,
  Plus,
  SealCheck,
  SoccerBall,
  Star,
  Storefront,
  UsersThree,
} from "@phosphor-icons/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import StoreButtons from "./components/StoreButtons";

/* ─── DATA ──────────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    id: "book",
    icon: Lightning,
    headline: "Book in seconds.",
    sub: "Real-time availability across hundreds of fields.",
    visual: (
      <div className="w-full flex flex-col gap-2">
        {["06:00 – 07:00", "08:00 – 09:00", "11:00 – 12:00"].map((slot, i) => (
          <div
            key={slot}
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-medium tabular-nums ${
              i === 1
                ? "bg-lime text-night"
                : "bg-night/50 border border-chalk/10 text-chalk/55"
            }`}
          >
            <span>{slot}</span>
            <span>{i === 1 ? "Selected ✓" : "Open"}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "pay",
    icon: CreditCard,
    headline: "Pay & play.",
    sub: "No cash. No deposits. Instant payment, instant confirmation.",
    visual: (
      <div className="flex flex-col items-center gap-2">
        <p className="text-lime font-display text-[88px]">₹450</p>
        <p className="text-moss text-[13px] mt-1">Turf booked · 2 hrs</p>
        <div className="mt-3 px-6 py-2 rounded-full bg-lime text-night text-[13px] font-bold">
          Paid ✓
        </div>
      </div>
    ),
  },
  {
    id: "sport",
    icon: SoccerBall,
    headline: "Any sport, any time.",
    sub: "Football, cricket, basketball, tennis, padel — one app.",
    visual: (
      <div className="w-full grid grid-cols-3 gap-2">
        {[["⚽","Football"],["🏏","Cricket"],["🏀","Basketball"],["🎾","Tennis"],["🏸","Badminton"],["🏑","Hockey"]].map(([e, l]) => (
          <div key={l} className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-night/50 border border-chalk/10">
            <span className="text-2xl" aria-hidden>{e}</span>
            <span className="text-moss text-[10px]">{l}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "team",
    icon: UsersThree,
    headline: "Team-ready.",
    sub: "Invite teammates, split costs, organise the match — all at once.",
    visual: (
      <div className="w-full flex flex-col gap-2">
        {[{ n: "Rahul", p: true }, { n: "Priya", p: true }, { n: "Arjun", p: false }].map(({ n, p }) => (
          <div key={n} className="flex items-center justify-between bg-night/50 border border-chalk/10 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-turf border border-chalk/15 flex items-center justify-center text-[11px] text-chalk/70 font-semibold">
                {n[0]}
              </div>
              <span className="text-chalk/75 text-[13px]">{n}</span>
            </div>
            <span className={`text-[13px] font-semibold ${p ? "text-lime" : "text-moss/60"}`}>
              {p ? "Paid ✓" : "Pending"}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "coins",
    icon: Coins,
    headline: "Earn TurfCoins.",
    sub: "Every booking earns you TurfCoins. Redeem for free slots and perks.",
    visual: (
      <div className="flex flex-col items-center gap-1.5">
        <div className="w-16 h-16 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center text-3xl" aria-hidden>
          🪙
        </div>
        <p className="text-lime font-display text-[64px] mt-3">1,240</p>
        <p className="text-moss text-[13px] mt-1">TurfCoins earned</p>
      </div>
    ),
  },
];

const STEPS = [
  {
    step: "01",
    headline: "Browse & filter.",
    body: "Search venues near you. See live slot availability across 20+ sports facilities — updated in real time.",
    visual: (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
          <MapPin size={16} weight="fill" className="text-lime" />
          <span className="text-moss text-[13px]">Koramangala, Bangalore</span>
        </div>
        {["Greenfield Arena · 0.8 km", "PlayZone Turf · 1.4 km", "AceField FC · 2.1 km"].map((v, i) => (
          <div key={v} className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] ${i === 0 ? "bg-lime/10 border border-lime/30" : "bg-night/50 border border-chalk/8"}`}>
            <span className={i === 0 ? "text-chalk" : "text-chalk/45"}>{v}</span>
            <span className={`font-semibold ${i === 0 ? "text-lime" : "text-moss/60"}`}>{i === 0 ? "5 slots" : "Full"}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    step: "02",
    headline: "Book & pay.",
    body: "Pick your slot, pay instantly with UPI, card, or TurfCoins. Instant confirmation — no deposits, no calls.",
    visual: (
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-3.5 py-3 rounded-xl bg-lime/10 border border-lime/30">
          <span className="text-chalk text-[13px] font-medium">Saturday · 8 AM – 9 AM</span>
          <span className="text-lime text-[13px] font-bold">₹450</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["UPI", "Card", "TurfCoins"].map((m) => (
            <div key={m} className="flex items-center justify-center py-2.5 rounded-lg bg-night/50 border border-chalk/10 text-chalk/55 text-[11px] font-medium">{m}</div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-full bg-lime text-night text-[13px] font-bold">
          Confirm Booking <ArrowRight size={14} weight="bold" />
        </div>
      </div>
    ),
  },
  {
    step: "03",
    headline: "Show up & play.",
    body: "Walk in. Your slot is held. No paperwork, no cash at the door. TurfIn handles the rest — you just play.",
    visual: (
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-lime text-night flex items-center justify-center">
          <Check size={26} weight="bold" />
        </div>
        <div className="text-center">
          <p className="text-chalk text-[15px] font-bold">Booking Confirmed</p>
          <p className="text-moss text-[13px] mt-0.5">Greenfield Arena · Gate B</p>
        </div>
        <div className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-night/50 border border-chalk/8">
          <span className="text-moss text-[13px]">TurfCoins earned</span>
          <span className="text-lime text-[13px] font-bold">+60 TC</span>
        </div>
      </div>
    ),
  },
];

const TESTIMONIALS = [
  { name: "Rahul S.",    handle: "@rahulplays", text: "Finally booked a football ground in under 2 minutes. TurfIn is genuinely a game-changer." },
  { name: "Priya M.",   handle: "@priyas",     text: "No more calling venue managers or paying cash deposits. Just open the app and play." },
  { name: "Karthik R.", handle: "@karthik_r",  text: "The team split feature alone is worth the download. Our whole squad uses it every weekend." },
  { name: "Sneha T.",   handle: "@sneha_t",    text: "Best UX I've seen for sports booking. Everything is instant — bookings, payments, confirmations." },
  { name: "Dev P.",     handle: "@devp",       text: "TurfCoins are a genius idea. I've already earned enough for a free hour this month." },
  { name: "Aisha K.",   handle: "@aishak",     text: "Incredible — I can see real-time availability for 20+ venues near me. The old way was embarrassing." },
];

const FAQS = [
  { q: "How does real-time booking work?",  a: "TurfIn connects directly to venue management systems to show live slot availability. When you tap to book, the slot is reserved instantly — no back-and-forth with venue staff." },
  { q: "Which sports does TurfIn support?", a: "Football, cricket, basketball, tennis, badminton, padel, and more. We're constantly onboarding new venue types. If your sport isn't listed yet, drop us a note." },
  { q: "Are there any booking fees?",       a: "No hidden fees. You pay the venue rate shown in the app — that's it. We're upfront about everything." },
  { q: "Can I cancel or reschedule?",       a: "Yes. Cancellation and rescheduling policies are set per venue and shown clearly before you confirm. Most venues allow free cancellation up to 2 hours before the slot." },
  { q: "What are TurfCoins?",               a: "TurfCoins are TurfIn's reward currency. Every booking earns you TurfCoins, which you can redeem for free slot hours, upgrades, or partner perks." },
  { q: "Where can I download TurfIn?",      a: "TurfIn is live on the App Store and Google Play. Search for TurfIn, or use the download buttons on this page." },
  { q: "I own a turf. How do I list it?",   a: "Download TurfIn Ops, our app for venue partners, from the App Store or Google Play. It lets you manage your slots, bookings and payments in one place." },
];

const HERO_STATS = [
  { val: "Live", label: "on iOS & Android" },
  { val: "6",    label: "sports" },
  { val: "20+",  label: "venue partners" },
  { val: "₹0",   label: "booking fees" },
];

/* ─── SHARED COMPONENTS ─────────────────────────────────────────────────── */

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** Section heading whose lines rise out of a mask when scrolled into view */
function RevealHeading({
  lines,
  className = "",
  as: Tag = "h2",
}: {
  lines: ReactNode[];
  className?: string;
  as?: "h2" | "h3";
}) {
  return (
    <Tag data-reveal className={`font-display text-chalk ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <span style={delay(i * 90)}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/** Small section marker — a short chalk rule and a plain-language name */
function SectionMark({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-moss text-sm mb-6">
      <span className="w-6 h-px bg-lime" aria-hidden />
      {children}
    </p>
  );
}

/** Single testimonial card — used in both marquee rows */
function TestimonialCard({ t }: { t: (typeof TESTIMONIALS)[0] }) {
  return (
    <figure className="flex-none w-[300px] md:w-[380px] bg-pitch border border-chalk/10 rounded-[20px] p-6 flex flex-col">
      <div className="flex items-center gap-0.5 mb-4 text-lime" aria-label="5 out of 5 stars">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={13} weight="fill" />
        ))}
      </div>
      <blockquote className="text-chalk/85 text-[15px] md:text-[17px] leading-snug mb-6">{t.text}</blockquote>
      <figcaption className="mt-auto flex items-center gap-3 pt-4 border-t border-chalk/8">
        <div className="w-8 h-8 rounded-full bg-turf border border-chalk/15 flex items-center justify-center text-xs text-chalk/70 flex-none font-semibold">
          {t.name[0]}
        </div>
        <div className="flex-1">
          <p className="text-chalk text-sm font-semibold leading-none">{t.name}</p>
          <p className="text-moss text-xs mt-1">{t.handle}</p>
        </div>
        <span className="flex items-center gap-1 text-lime/75 text-[11px] font-medium">
          <SealCheck size={14} weight="fill" />
          Verified
        </span>
      </figcaption>
    </figure>
  );
}

/* ─── PAGE ───────────────────────────────────────────────────────────────── */

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const midfieldRef = useRef<HTMLElement>(null);

  // Section headings reveal once when they enter the viewport
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("revealed");
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Scroll-linked motion: hero parallax, pinned feature track (lg+), midfield circle draw.
  // Lenis drives the native scroll position, so a plain scroll listener stays in sync with it.
  useEffect(() => {
    const hero = heroRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    const midfield = midfieldRef.current;
    if (!hero || !pin || !track || !midfield) return;

    const desktop = window.matchMedia("(min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let distance = 0;
    let frame = 0;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;

      if (!reduced.matches) {
        const heroP = Math.min(1, Math.max(0, window.scrollY / hero.offsetHeight));
        hero.style.setProperty("--hero-p", heroP.toFixed(4));
      }

      if (distance > 0) {
        const p = Math.min(1, Math.max(0, -pin.getBoundingClientRect().top / distance));
        track.style.transform = `translate3d(${(-p * distance).toFixed(1)}px,0,0)`;
        pin.style.setProperty("--pin-p", p.toFixed(4));
      }

      const top = midfield.getBoundingClientRect().top;
      const draw = Math.min(1, Math.max(0, (vh - top) / (vh * 0.85)));
      midfield.style.setProperty("--draw", draw.toFixed(4));
    };

    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const measure = () => {
      if (desktop.matches) {
        distance = Math.max(0, track.offsetWidth - window.innerWidth);
        pin.style.height = `${window.innerHeight + distance}px`;
        track.removeAttribute("data-lenis-prevent-wheel");
      } else {
        distance = 0;
        pin.style.height = "";
        track.style.transform = "";
        // Let trackpads scroll the card row sideways on smaller screens
        track.setAttribute("data-lenis-prevent-wheel", "");
      }
      requestUpdate();
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    desktop.addEventListener("change", measure);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", requestUpdate);
      desktop.removeEventListener("change", measure);
    };
  }, []);

  return (
    <main className="bg-night text-chalk overflow-x-clip">
      <Navbar />

      {/* ══════════════════════════════════════════════════════════════════
          HERO — full-bleed floodlit pitch, stadium lettering, scoreboard strip
      ══════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-[100svh] min-h-[640px] overflow-hidden grain">
        {/* Photo: parallax wrapper (scroll) + scale-in (load) */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{ transform: "translate3d(0, calc(var(--hero-p, 0) * 22%), 0)" }}
        >
          <div className="absolute inset-0 hero-media-in">
            <Image
              src="/turfInBG.png"
              alt="Floodlit turf pitch at night"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[50%_65%]"
            />
          </div>
        </div>

        {/* Readability layers */}
        <div className="absolute inset-0 bg-linear-to-t from-night via-night/60 to-night/5" />
        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-night/70 to-transparent" />
        <div className="absolute inset-0 bg-night pointer-events-none" style={{ opacity: "calc(var(--hero-p, 0) * 0.85)" }} />

        <div className="relative z-10 h-full flex flex-col justify-end px-5 md:px-10 pb-5 md:pb-7">
          {/* Live status */}
          <div className="soft-in flex items-center gap-2.5 mb-5 md:mb-6" style={delay(700)}>
            <span className="w-2 h-2 rounded-full bg-lime live-dot" />
            <span className="text-lime text-sm font-medium">
              Live now on the App Store and Google Play
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7 lg:gap-12">
            <h1 className="font-display text-chalk text-[clamp(84px,21vw,150px)] lg:text-[clamp(150px,15.4vw,270px)]">
              <span className="line-mask"><span style={delay(250)}>Book your</span></span>
              <span className="line-mask"><span style={delay(360)}>turf.</span></span>
            </h1>

            <div className="lg:max-w-[380px] lg:flex-none lg:pb-3">
              <p className="soft-in text-chalk/80 text-base md:text-lg leading-relaxed mb-6 max-w-[36ch]" style={delay(850)}>
                Find, book, and pay for sports fields in real time.
                No calls. No deposits. Just play.
              </p>
              <div className="soft-in" style={delay(950)}>
                <StoreButtons />
              </div>
            </div>
          </div>

          {/* Scoreboard strip */}
          <div className="relative mt-8 md:mt-10">
            <span className="chalk-draw absolute top-0 inset-x-0 h-px bg-chalk/30" style={delay(600)} />
            <div className="soft-in flex items-stretch justify-between" style={delay(1050)}>
              <dl className="grid grid-cols-2 md:grid-cols-4 flex-1">
                {HERO_STATS.map(({ val, label }, i) => (
                  <div
                    key={label}
                    className={`flex flex-col-reverse pt-4 md:pt-5 pb-1 ${i > 0 ? "md:pl-6 md:border-l md:border-chalk/15" : ""}`}
                  >
                    <dt className="text-moss text-xs md:text-sm mt-1">{label}</dt>
                    <dd className="font-display text-chalk text-[34px] md:text-[44px]">{val}</dd>
                  </div>
                ))}
              </dl>
              <div className="hidden md:flex items-end gap-2 pl-6 pb-2 text-moss text-sm border-l border-chalk/15">
                Scroll
                <ArrowDown size={14} className="animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FEATURES — pinned horizontal track on desktop, swipe row on mobile
      ══════════════════════════════════════════════════════════════════ */}
      <section id="features" ref={pinRef} className="relative">
        <div className="lg:sticky lg:top-0 lg:h-svh lg:overflow-hidden flex flex-col justify-center py-24 md:py-32 lg:py-0">
          <div className="px-5 md:px-10 mb-10 lg:mb-12 flex items-end justify-between gap-6 flex-wrap">
            <div>
              <SectionMark>The Platform</SectionMark>
              <RevealHeading
                lines={["Everything you need to book and play."]}
                className="max-w-[9.6em] text-[clamp(46px,11.5vw,72px)] lg:text-[clamp(72px,6.2vw,104px)]"
              />
            </div>

            {/* Track progress (desktop) */}
            <div className="hidden lg:flex items-center gap-4 pb-3 text-moss text-sm">
              <span>Scroll to explore</span>
              <span className="relative w-40 h-px bg-chalk/15 overflow-hidden">
                <span
                  className="absolute inset-y-0 left-0 w-full bg-lime origin-left"
                  style={{ transform: "scaleX(var(--pin-p, 0))" }}
                />
              </span>
            </div>

            {/* Swipe hint — mobile only */}
            <p className="lg:hidden text-moss text-sm flex items-center gap-1.5 pb-2">
              Swipe
              <ArrowRight size={14} />
            </p>
          </div>

          <div
            ref={trackRef}
            className="flex gap-4 md:gap-5 overflow-x-auto lg:overflow-visible hide-scrollbar px-5 md:px-10 pb-2 lg:w-max will-change-transform snap-x snap-mandatory lg:snap-none scroll-px-5 md:scroll-px-10"
          >
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <article
                  key={f.id}
                  className="group snap-start flex-none w-[84vw] xs:w-[340px] md:w-[360px] lg:w-[400px] h-[480px] lg:h-[min(540px,58svh)] lg:min-h-[460px] mown border border-chalk/10 rounded-[24px] p-6 flex flex-col transition-colors duration-500 hover:border-lime/30"
                >
                  <span className="w-10 h-10 rounded-full bg-lime/10 border border-lime/25 text-lime flex items-center justify-center flex-none">
                    <Icon size={18} weight="fill" />
                  </span>
                  <div className="flex-1 flex items-center justify-center py-6">{f.visual}</div>
                  <h3 className="font-display text-chalk text-[40px] lg:text-[48px]">{f.headline}</h3>
                  <p className="text-moss text-sm leading-relaxed mt-2.5 max-w-[32ch]">{f.sub}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          HOW IT WORKS — three steps along one chalk line
      ══════════════════════════════════════════════════════════════════ */}
      <section className="px-5 md:px-10 py-24 md:py-36 border-t border-chalk/10">
        <SectionMark>How it works</SectionMark>
        <RevealHeading lines={["Three taps.", "Zero hassle."]} className="text-[clamp(56px,9vw,128px)]" />

        <ol className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-3 border-t border-chalk/20">
          {STEPS.map(({ step, headline, body, visual }, i) => (
            <li
              key={step}
              className={`relative flex flex-col pt-10 pb-12 md:pb-4 border-b md:border-b-0 border-chalk/10 ${
                i > 0 ? "md:pl-8 lg:pl-10 md:border-l md:border-chalk/10" : ""
              } ${i < 2 ? "md:pr-8 lg:pr-10" : ""}`}
            >
              <span
                className={`absolute -top-[5px] w-[9px] h-[9px] rounded-full bg-lime ${i > 0 ? "left-0 md:left-8 lg:left-10" : "left-0"}`}
                aria-hidden
              />
              <span className="font-display text-outline text-[96px] md:text-[120px]" aria-hidden>{step}</span>
              <h3 className="font-display text-chalk text-[40px] md:text-[48px] mt-6">{headline}</h3>
              <p className="text-moss text-[15px] leading-relaxed mt-3 max-w-[38ch]">{body}</p>
              <div className="mt-8 rounded-[20px] mown border border-chalk/10 p-4 md:p-5">{visual}</div>
            </li>
          ))}
        </ol>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          TESTIMONIALS — infinite double marquee
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-36 overflow-hidden border-t border-chalk/10">
        <div className="px-5 md:px-10 mb-12 md:mb-16">
          <SectionMark>Real players. Real matches.</SectionMark>
          <RevealHeading lines={["Loved by the", "community."]} className="text-[clamp(56px,9vw,128px)]" />
        </div>

        {/* Row 1 — left scroll */}
        <div className="marquee-track marquee-fade overflow-hidden mb-4">
          <div className="animate-marquee flex gap-4" style={{ width: "max-content" }}>
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <TestimonialCard key={i} t={t} />
            ))}
          </div>
        </div>

        {/* Row 2 — right scroll */}
        <div className="marquee-track marquee-fade overflow-hidden">
          <div
            className="animate-marquee-slow flex gap-4"
            style={{ width: "max-content", animationDirection: "reverse" }}
          >
            {[...TESTIMONIALS.slice(3), ...TESTIMONIALS, ...TESTIMONIALS.slice(3)].map((t, i) => (
              <TestimonialCard key={i} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          ABOUT — two callouts: the pitch, and the floodlight
      ══════════════════════════════════════════════════════════════════ */}
      <section id="about" className="px-5 md:px-10 py-24 md:py-36 border-t border-chalk/10">
        <SectionMark>Why TurfIn</SectionMark>
        <RevealHeading lines={["Built for players,", "not paperwork."]} className="text-[clamp(56px,9vw,128px)]" />

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">

          {/* Callout 1 — booking control */}
          <a
            href="#download"
            className="group mown border border-chalk/10 rounded-[28px] p-7 md:p-10 flex flex-col min-h-[540px] relative overflow-hidden transition-colors duration-500 hover:border-chalk/25"
          >
            <div className="flex items-start justify-between gap-6">
              <p className="font-display text-chalk text-[52px] md:text-[64px]">
                Your turf.<br />Your rules.
              </p>
              <span className="flex items-center gap-2 text-lime text-sm font-semibold flex-none">
                <span className="hidden md:inline opacity-0 -translate-x-2 transition-all duration-500 ease-out-expo group-hover:opacity-100 group-hover:translate-x-0">
                  Get the app
                </span>
                <span className="w-11 h-11 rounded-full border border-lime/40 flex items-center justify-center transition-colors duration-300 group-hover:bg-lime group-hover:text-night">
                  <ArrowUpRight size={18} weight="bold" className="transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
                </span>
              </span>
            </div>
            <p className="text-moss text-[15px] leading-relaxed max-w-[40ch] mt-5">
              Real-time slot visibility, instant booking confirmation,
              and zero friction — TurfIn puts you in control of your game.
            </p>

            <div className="mt-auto pt-10">
              <div className="rounded-[20px] bg-night/60 border border-chalk/10 p-4 md:p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-chalk/80 text-sm font-medium">Saturday, 22 Mar</p>
                  <span className="text-lime text-xs font-semibold border border-lime/35 rounded-full px-2.5 py-1">
                    5 slots open
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM"].map((t, i) => (
                    <div
                      key={t}
                      className={`text-center py-3 rounded-xl text-xs font-medium ${
                        i === 2 ? "bg-lime text-night"
                        : i === 4 ? "bg-chalk/5 text-chalk/20 line-through"
                        : "bg-chalk/5 text-chalk/60"
                      }`}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </a>

          {/* Callout 2 — TurfCoins rewards (the floodlight) */}
          <a
            href="#download"
            className="group mown-lime text-night rounded-[28px] p-7 md:p-10 flex flex-col min-h-[540px] relative overflow-hidden"
          >
            <p className="font-display text-[52px] md:text-[64px]">
              Play TurfIn.<br />Own the game.
            </p>
            <p className="text-night/70 text-[15px] leading-relaxed max-w-[40ch] mt-5">
              Every booking earns you TurfCoins. You&apos;re not just a user —
              redeem them for free slots, upgrades and partner perks.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 text-sm font-bold">
              Read more
              <ArrowRight size={15} weight="bold" className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5" />
            </p>

            <div className="mt-auto pt-10 flex flex-col gap-2">
              {[
                { label: "Booking · 2 hrs", coins: "+120 TC", date: "Today"     },
                { label: "Booking · 1 hr",  coins: "+60 TC",  date: "Yesterday" },
                { label: "Referral bonus",  coins: "+500 TC", date: "Mar 18"    },
              ].map(({ label, coins, date }) => (
                <div key={label} className="flex items-center justify-between bg-night/[0.07] border border-night/10 rounded-2xl px-4 py-3.5">
                  <div>
                    <p className="text-night text-sm font-semibold">{label}</p>
                    <p className="text-night/55 text-xs mt-0.5">{date}</p>
                  </div>
                  <span className="font-display text-night text-[28px]">{coins}</span>
                </div>
              ))}
            </div>
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          RECOGNITION — DPIIT / Startup India certificate
      ══════════════════════════════════════════════════════════════════ */}
      <section id="recognition" className="px-5 md:px-10 py-24 md:py-32 border-t border-chalk/10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-14 lg:gap-20 items-center">
          <div>
            <SectionMark>Government recognised</SectionMark>
            <RevealHeading lines={["Recognised by", "Startup India."]} className="text-[clamp(48px,13vw,112px)] lg:text-[clamp(56px,6.3vw,100px)]" />
            <p className="text-moss text-[15px] md:text-base leading-relaxed mt-6 max-w-[48ch]">
              TurfIn is built by RE Orbit Innovations Pvt. Ltd., recognised as a startup by the
              Department for Promotion of Industry and Internal Trade (DPIIT), Government of India.
            </p>

            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 mt-10 border-t border-chalk/15">
              {[
                { label: "Certificate no.", val: "DIPP270091" },
                { label: "Issued",          val: "01 Jul 2026" },
                { label: "Valid until",     val: "18 May 2035" },
              ].map(({ label, val }, i) => (
                <div key={label} className={`flex flex-col-reverse pt-5 ${i > 0 ? "sm:pl-5 sm:border-l sm:border-chalk/15" : ""}`}>
                  <dt className="text-moss text-xs md:text-sm mt-1">{label}</dt>
                  <dd className="font-display text-chalk text-[28px] md:text-[34px]">{val}</dd>
                </div>
              ))}
            </dl>

            <a
              href="/dpiit-startup-certificate.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 h-12 px-5 mt-10 rounded-full border border-chalk/25 text-chalk text-sm font-semibold transition-colors duration-300 hover:border-chalk hover:bg-chalk hover:text-night"
            >
              <SealCheck size={16} weight="fill" className="text-lime transition-colors duration-300 group-hover:text-night" />
              View certificate (PDF)
            </a>
          </div>

          {/* The certificate, pinned slightly askew like a notice on the clubhouse board */}
          <a
            href="/dpiit-startup-certificate.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the DPIIT certificate of recognition (PDF)"
            className="group relative block"
          >
            <span className="absolute -inset-4 md:-inset-6 rounded-[32px] mown border border-chalk/10" aria-hidden />
            <span className="relative block rounded-[6px] overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] rotate-[-1.5deg] transition-transform duration-700 ease-out-expo group-hover:rotate-0 group-hover:scale-[1.015]">
              <Image
                src="/dpiit-startup-certificate.jpg"
                alt="DPIIT Certificate of Recognition issued to RE Orbit Innovations Private Limited, certificate number DIPP270091"
                width={1600}
                height={1130}
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="w-full h-auto"
              />
            </span>
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-lime shadow-[0_2px_6px_rgba(0,0,0,0.5)]" aria-hidden />
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          CTA — midfield: halfway line and centre circle drawn on scroll
      ══════════════════════════════════════════════════════════════════ */}
      <section ref={midfieldRef} className="relative py-28 md:py-44 px-5 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
          <span
            className="absolute left-0 right-0 top-1/2 h-px bg-chalk/15 origin-center"
            style={{ transform: "scaleX(var(--draw, 0))" }}
          />
          <svg viewBox="0 0 100 100" className="w-[min(110vw,760px)] aspect-square overflow-visible">
            <circle
              cx="50" cy="50" r="49.5"
              pathLength={1}
              fill="none"
              stroke="rgba(238,242,230,0.15)"
              strokeWidth="0.25"
              className="pitch-draw"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-lime" style={{ opacity: "var(--draw, 0)" }} />
        </div>

        <div className="relative">
          <RevealHeading
            lines={["Your field.", "One tap away."]}
            className="text-[clamp(64px,13vw,220px)] mb-8"
          />
          <p className="text-chalk/70 text-base md:text-lg max-w-[46ch] mx-auto mb-8 leading-relaxed">
            Stop calling venue managers. Stop paying cash deposits.
            TurfIn books your favourite ground in seconds — and rewards you for every match.
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {["20+ venues", "6 sports", "₹0 booking fees", "Instant confirmation"].map((chip) => (
              <li key={chip} className="px-4 py-2 rounded-full bg-night border border-chalk/15 text-chalk/75 text-sm">
                {chip}
              </li>
            ))}
          </ul>
          <a
            href="#download"
            className="group inline-flex items-center gap-3 h-14 pl-7 pr-2 rounded-full bg-lime text-night text-base font-semibold transition-colors duration-300 hover:bg-chalk"
          >
            Download the app
            <span className="w-10 h-10 rounded-full bg-night text-lime flex items-center justify-center">
              <ArrowRight size={16} weight="bold" className="transition-transform duration-500 ease-out-expo group-hover:-rotate-45" />
            </span>
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FAQ + HERO REPEAT — split layout
          On mobile: FAQs shown first (order-1), hero repeat below (order-2)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="px-5 md:px-10 py-24 md:py-32 grid grid-cols-1 md:grid-cols-[1fr_1.25fr] gap-16 md:gap-20 border-t border-chalk/10">

        {/* Left — hero headline repeat + CTA buttons */}
        <div className="order-2 md:order-1 md:sticky md:top-28 self-start">
          <h2 className="font-display text-chalk text-[clamp(80px,7.6vw,132px)] mb-6">
            Book your<br />turf.
          </h2>
          <p className="text-moss text-[15px] leading-relaxed mb-8 max-w-[34ch]">
            Find, book, and pay for sports fields in real time.
            No calls. No deposits. Just play.
          </p>

          <StoreButtons className="mb-6" />

          <p className="text-moss text-sm">
            Live on iOS and Android.
          </p>
        </div>

        {/* Right — FAQ accordion */}
        <div className="order-1 md:order-2">
          <SectionMark>FAQ</SectionMark>
          <div className="border-t border-chalk/15">
            {FAQS.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={i} className="border-b border-chalk/15">
                  <h3>
                    <button
                      id={`faq-q-${i}`}
                      aria-expanded={open}
                      aria-controls={`faq-a-${i}`}
                      className="group w-full flex items-center justify-between gap-6 py-6 md:py-7 text-left cursor-pointer"
                      onClick={() => setOpenFaq(open ? null : i)}
                    >
                      <span className={`text-lg md:text-xl font-medium transition-colors duration-300 ${open ? "text-lime" : "text-chalk group-hover:text-lime"}`}>
                        {faq.q}
                      </span>
                      <span
                        className={`flex-none w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-500 ease-out-expo ${
                          open ? "rotate-45 bg-lime border-lime text-night" : "border-chalk/25 text-chalk"
                        }`}
                      >
                        <Plus size={14} weight="bold" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-a-${i}`}
                    role="region"
                    aria-labelledby={`faq-q-${i}`}
                    className={`grid transition-[grid-template-rows] duration-500 ease-out-expo ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-moss text-[15px] md:text-base leading-relaxed pb-7 pr-14 max-w-[62ch]">{faq.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          DOWNLOAD — lime-framed panel with the penalty box marked out
          Player app on top, TurfIn Ops (venue app) below
      ══════════════════════════════════════════════════════════════════ */}
      <section id="download" className="relative px-3 xs:px-4 md:px-10 py-16 md:py-24">
        {/* Keeps older /#waitlist links landing here */}
        <span id="waitlist" className="absolute top-0" aria-hidden />

        <div className="relative mx-auto w-full max-w-[1120px] rounded-[36px] md:rounded-[48px] bg-lime p-1.5 md:p-2">
          <div className="relative rounded-[30px] md:rounded-[40px] mown overflow-hidden">
            {/* Penalty box markings */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-[78%] h-[44%] border-x border-b border-chalk/8" />
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-[38%] h-[16%] border-x border-b border-chalk/8" />
              <span className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[24%] aspect-[2/1] rounded-b-full border-x border-b border-chalk/8 [clip-path:inset(50%_0_0_0)]" />
            </div>

            <div className="relative w-full py-12 xs:py-14 md:py-20 px-5 xs:px-6 md:px-16 flex flex-col items-center text-center">

              {/* Status badge */}
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-night/60 border border-chalk/12 mb-8">
                <span className="w-2 h-2 rounded-full bg-lime live-dot" />
                <span className="text-lime text-xs md:text-sm font-medium">Live now</span>
              </div>

              {/* Headline */}
              <RevealHeading lines={["Get on", "the field."]} className="text-[clamp(60px,10vw,136px)]" />

              {/* Subtitle */}
              <p className="text-chalk/70 text-[15px] md:text-base leading-relaxed max-w-[46ch] mt-6">
                TurfIn is live on iOS and Android. Download the app, find a turf near you
                and book your first slot in seconds.
              </p>

              {/* What you get */}
              <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 mt-6">
                {[
                  "Live slot availability",
                  "Instant UPI & card payments",
                  "TurfCoins on every booking",
                ].map((perk) => (
                  <li key={perk} className="flex items-center gap-2 text-chalk/75 text-sm">
                    <span className="w-4 h-4 rounded-full bg-lime/15 text-lime flex items-center justify-center">
                      <Check size={10} weight="bold" />
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>

              {/* Player app */}
              <StoreButtons className="justify-center mt-10" />

              {/* Venue partners — TurfIn Ops */}
              <div className="w-full mt-14 md:mt-20 pt-10 md:pt-12 border-t border-chalk/12 flex flex-col md:flex-row items-center md:justify-between gap-7 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5">
                  <span className="w-12 h-12 rounded-full bg-night/60 border border-chalk/15 text-lime flex items-center justify-center flex-none">
                    <Storefront size={20} weight="fill" />
                  </span>
                  <div>
                    <h3 className="font-display text-chalk text-[40px] md:text-[48px]">Own a turf?</h3>
                    <p className="text-moss text-[15px] leading-relaxed mt-2 max-w-[44ch]">
                      Run your venue on TurfIn Ops — manage slots, bookings and payments from one app.
                    </p>
                  </div>
                </div>
                <StoreButtons app="vendor" className="justify-center md:justify-end md:flex-none" />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════ */}
      <div className="px-5 md:px-10">
        <Footer />
      </div>
    </main>
  );
}
