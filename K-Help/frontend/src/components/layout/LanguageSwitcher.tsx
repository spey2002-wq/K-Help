"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("h-5 w-5", className)}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18" />
      <path d="M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

type Props = {
  /** Compact icon-only control for the phone header. */
  compact?: boolean;
  className?: string;
};

export function LanguageSwitcher({ compact = false, className }: Props) {
  const { locale, locales, setLocale, current, t } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative notranslate", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("nav.language")}
        title={t("nav.language")}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg text-sm font-medium transition-colors",
          compact
            ? "h-9 w-9 justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            : "px-2.5 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900",
          open && "bg-brand-50 text-brand-700",
        )}
      >
        <GlobeIcon />
        {!compact && (
          <span className="uppercase tracking-wide">{current.code}</span>
        )}
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t("nav.language")}
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {t("nav.language")}
          </p>
          <ul className="max-h-72 overflow-y-auto">
            {locales.map((option) => {
              const active = option.code === locale;
              return (
                <li key={option.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      setLocale(option.code);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors",
                      active
                        ? "bg-brand-50 font-semibold text-brand-700"
                        : "text-slate-700 hover:bg-slate-50",
                    )}
                  >
                    <span className="text-base leading-none" aria-hidden>
                      {option.flag}
                    </span>
                    <span className="flex-1">
                      <span className="block">{option.nativeLabel}</span>
                      <span className="block text-xs font-normal text-slate-400">
                        {option.label}
                      </span>
                    </span>
                    {active && (
                      <span className="text-brand-600" aria-hidden>
                        ✓
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
