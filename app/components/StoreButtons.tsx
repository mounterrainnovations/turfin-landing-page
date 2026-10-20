import { STORE_LINKS, type AppKey as App } from "../lib/storeLinks";

export { STORE_LINKS };

const badge =
  "group inline-flex items-center gap-2.5 h-[52px] pl-3.5 pr-5 rounded-[12px] bg-black text-white border border-white/30 transition-[border-color,transform] duration-300 hover:border-white active:scale-[0.98]";

function AppleLogo() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden className="flex-none -mt-0.5">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

function PlayLogo() {
  return (
    <svg viewBox="0 0 20 22" width="22" height="24" aria-hidden className="flex-none">
      <path d="M1.2 1.1 11 11 1.2 20.9c-.3-.3-.4-.7-.4-1.2V2.3c0-.5.1-.9.4-1.2Z" fill="#4285F4" />
      <path d="M14.3 7.7 11 11 1.2 1.1c.4-.4 1.1-.5 1.8-.1l11.3 6.7Z" fill="#34A853" />
      <path d="M14.3 14.3 3 21c-.7.4-1.4.3-1.8-.1L11 11l3.3 3.3Z" fill="#EA4335" />
      <path d="m18.4 9.6-4.1-1.9L11 11l3.3 3.3 4.1-2c1-.6 1-2.1 0-2.7Z" fill="#FBBC04" />
    </svg>
  );
}

export function AppStoreButton({ href, label = "TurfIn" }: { href: string; label?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={badge} aria-label={`Download ${label} on the App Store`}>
      <AppleLogo />
      <span className="flex flex-col items-start leading-none">
        <span className="text-[10px] font-medium tracking-wide">Download on the</span>
        <span className="text-[19px] font-semibold tracking-tight mt-0.5">App Store</span>
      </span>
    </a>
  );
}

export function PlayStoreButton({ href, label = "TurfIn" }: { href: string; label?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={badge} aria-label={`Get ${label} on Google Play`}>
      <PlayLogo />
      <span className="flex flex-col items-start leading-none">
        <span className="text-[10px] font-medium tracking-wide">GET IT ON</span>
        <span className="text-[19px] font-semibold tracking-tight mt-0.5">Google Play</span>
      </span>
    </a>
  );
}

/** App Store + Google Play badge pair for the player app or the TurfIn Ops vendor app */
export default function StoreButtons({ app = "player", className = "" }: { app?: App; className?: string }) {
  const links = STORE_LINKS[app];
  const label = app === "vendor" ? "TurfIn Ops" : "TurfIn";
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <AppStoreButton href={links.ios} label={label} />
      <PlayStoreButton href={links.android} label={label} />
    </div>
  );
}
