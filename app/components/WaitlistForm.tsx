"use client";

import { useState, useRef } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { X, CheckCircle, Warning } from "@phosphor-icons/react";

const POPULAR_PROVIDERS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "protonmail.com",
  "zoho.com",
  "aol.com",
  "yandex.com",
  "mail.com",
];

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [inlineMsg, setInlineMsg] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [showTurnstile, setShowTurnstile] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const turnstileRef = useRef<TurnstileInstance>(null);

  const showToastMsg = (message: string, type: "success" | "error") => {
    setInlineMsg({ message, type });
  };

  const validateEmail = (mail: string) => {
    const cleanMail = mail.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanMail)) {
      return { valid: false, message: "Please enter a valid email address." };
    }

    const domain = cleanMail.split("@")[1];
    if (!POPULAR_PROVIDERS.includes(domain)) {
      return {
        valid: false,
        message: "Please use a popular email provider (Gmail, Outlook, etc.).",
      };
    }

    return { valid: true, cleanMail };
  };

  // Step 1: User clicks submit → validate email → show Turnstile overlay
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateEmail(email);
    if (!validation.valid) {
      showToastMsg(validation.message || "Invalid email", "error");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    // Email is valid — show Turnstile overlay
    setPendingEmail(validation.cleanMail!);
    setShowTurnstile(true);
  };

  // Step 2: User passes Turnstile → actually submit to API
  const handleTurnstileSuccess = async (token: string) => {
    setShowTurnstile(false);
    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pendingEmail,
          turnstileToken: token,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      showToastMsg("You've been added to the waitlist! 🎉", "success");
      setStatus("success");
      setEmail("");
      setPendingEmail("");
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      setStatus("error");
      showToastMsg(
        err instanceof Error ? err.message : "Something went wrong.",
        "error"
      );
      setTimeout(() => setStatus("idle"), 4000);
    } finally {
      turnstileRef.current?.reset();
    }
  };

  const handleTurnstileClose = () => {
    setShowTurnstile(false);
    turnstileRef.current?.reset();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col md:flex-row items-stretch gap-2.5 md:gap-0 md:p-1.5 md:rounded-full md:bg-night/70 md:border md:border-chalk/15 md:focus-within:border-lime/60 transition-colors duration-300"
      >
        <div className="w-full flex-1 relative">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (inlineMsg?.type === "error") setInlineMsg(null); }}
            placeholder="Your mail address"
            aria-label="Email address"
            autoComplete="email"
            required
            className="w-full h-[54px] md:h-12 rounded-full bg-night/70 md:bg-transparent border border-chalk/15 md:border-0 px-6 text-chalk text-[15px] placeholder:text-moss/70 outline-none focus:border-lime/60 focus-visible:outline-none transition-colors duration-300"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full md:w-auto h-[54px] md:h-12 px-8 rounded-full bg-lime text-night font-semibold text-sm hover:bg-chalk active:scale-[0.97] transition-[background-color,transform] duration-300 whitespace-nowrap disabled:opacity-70 cursor-pointer"
        >
          {status === "loading" ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Joining...
            </span>
          ) : status === "success" ? (
            "You're in! 🎉"
          ) : status === "error" ? (
            "Try again"
          ) : (
            "Join waitlist"
          )}
        </button>
      </form>

      {/* Inline notification */}
      {inlineMsg && (
        <div
          role="status"
          className={`w-full mt-3 flex items-center gap-3 px-4 py-3 rounded-2xl border text-left animate-fade-up ${
            inlineMsg.type === "success"
              ? "bg-lime/10 border-lime/30 text-lime"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          <span className="flex-shrink-0">
            {inlineMsg.type === "success"
              ? <CheckCircle size={18} weight="fill" />
              : <Warning size={18} weight="fill" />}
          </span>
          <p className="text-sm font-medium flex-1">{inlineMsg.message}</p>
          <button
            type="button"
            onClick={() => setInlineMsg(null)}
            aria-label="Dismiss message"
            className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors opacity-50 hover:opacity-100"
          >
            <X size={14} weight="bold" />
          </button>
        </div>
      )}

      {/* Full-Screen Turnstile Overlay */}
      {showTurnstile && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-night/80 backdrop-blur-md animate-fade-in" data-lenis-prevent>
          <div role="dialog" aria-modal="true" aria-labelledby="turnstile-title" className="relative flex flex-col items-center gap-6 p-8 rounded-[28px] border border-chalk/12 bg-pitch shadow-2xl max-w-sm w-full mx-4">
            {/* Close button */}
            <button
              onClick={handleTurnstileClose}
              aria-label="Close security check"
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-chalk/10 transition-colors text-moss hover:text-chalk"
            >
              <X size={18} weight="bold" />
            </button>

            {/* Title */}
            <div className="flex flex-col items-center gap-2 pt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-lime live-dot" />
              <h3 id="turnstile-title" className="text-chalk text-lg font-bold tracking-tight">
                Security Check
              </h3>
              <p className="text-moss text-xs text-center">
                Please verify you&apos;re human to continue
              </p>
            </div>

            {/* Turnstile Widget */}
            <div className="flex justify-center">
              <Turnstile
                ref={turnstileRef}
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                onSuccess={handleTurnstileSuccess}
                onExpire={() => {
                  turnstileRef.current?.reset();
                }}
                onError={() => {
                  showToastMsg("Security check failed. Please try again.", "error");
                  setShowTurnstile(false);
                }}
                options={{
                  theme: "dark",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
