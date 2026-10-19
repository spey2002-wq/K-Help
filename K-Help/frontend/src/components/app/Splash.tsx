"use client";

import { useEffect, useState } from "react";

const SEEN_KEY = "khelp-splash-seen";

/**
 * Short opening screen shown once per visit on phones and in the installed app.
 * The fade-out is pure CSS (see .splash in globals.css), so it never blocks the page.
 */
export function Splash() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY)) {
        setGone(true);
        return;
      }
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Private mode: just show it once per page load.
    }
    const timer = window.setTimeout(() => setGone(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  if (gone) return null;

  return (
    <div className="splash" aria-hidden>
      <div className="flex flex-col items-center text-center">
        <span className="grid h-24 w-24 animate-pop-in place-items-center rounded-[1.75rem] bg-brand-gradient text-5xl font-extrabold text-white shadow-soft">
          K
        </span>
        <p className="mt-6 text-2xl font-bold tracking-tight text-slate-900">K-Help</p>
        <p className="mt-1 text-sm text-slate-500">Your life in Korea, made easier</p>
        <span className="mt-8 flex gap-1.5">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className="h-2 w-2 animate-bounce rounded-full bg-brand-400"
              style={{ animationDelay: `${dot * 120}ms` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
