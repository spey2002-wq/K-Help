"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { InstallAppButton } from "@/components/app/InstallAppButton";
import { cn } from "@/lib/utils";

type IconName =
  | "home"
  | "book"
  | "briefcase"
  | "building"
  | "grid"
  | "chat"
  | "users"
  | "sparkles"
  | "user"
  | "clipboard"
  | "shield"
  | "code"
  | "logout";

const ICON_PATHS: Record<IconName, string> = {
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  book: "M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z",
  briefcase: "M3 7h18v13H3z M8 7V4h8v3 M3 13h18",
  building:
    "M4 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17 M15 9h4a1 1 0 0 1 1 1v11 M2 21h20 M8 7h3 M8 11h3 M8 15h3",
  grid: "M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z",
  chat: "M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-5.4A8 8 0 1 1 21 12z",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.9 M16 3.1a4 4 0 0 1 0 7.8",
  sparkles:
    "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  clipboard:
    "M9 3h6v4H9z M7 5H5a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2 M9 12h6 M9 16h6",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  code: "M16 18l6-6-6-6 M8 6l-6 6 6 6",
  logout: "M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4 M16 17l5-5-5-5 M21 12H9",
};

function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("h-6 w-6", className)}
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}

const TABS: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/info", label: "Guides", icon: "book" },
  { href: "/jobs", label: "Jobs", icon: "briefcase" },
  { href: "/housing", label: "Housing", icon: "building" },
];

const MORE_PATHS = ["/community", "/chat", "/ai", "/profile", "/admin", "/login", "/register"];

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Phone-only tab bar with a "More" sheet, like a native app. */
export function BottomNav() {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);

  // Close the sheet whenever the page changes.
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moreOpen]);

  // The message box in a conversation needs the bottom of the screen.
  if (/^\/chat\/[^/]+/.test(pathname)) return null;

  const moreActive = MORE_PATHS.some((path) => isActive(pathname, path));

  const moreLinks: { href: string; label: string; hint: string; icon: IconName }[] = [
    { href: "/community", label: "Community", hint: "Ask and share", icon: "users" },
    { href: "/chat", label: "Chat", hint: "Your messages", icon: "chat" },
    { href: "/ai", label: "AI Assistant", hint: "Translate Korean", icon: "sparkles" },
  ];
  if (isAuthenticated) {
    moreLinks.push(
      { href: "/profile", label: "My profile", hint: user?.username ?? "Photo and skills", icon: "user" },
      { href: "/jobs/applications", label: "Applications", hint: "Jobs you applied to", icon: "clipboard" },
    { href: "/tech", label: "How it's built", hint: "Frontend, backend, data", icon: "code" },
    );
  }
  if (isAdmin) {
    moreLinks.push({ href: "/admin", label: "Admin", hint: "Moderation", icon: "shield" });
  }

  return (
    <>
      {moreOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="More">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={() => setMoreOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] animate-sheet-up overflow-y-auto rounded-t-3xl bg-white px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-3 shadow-2xl">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-slate-300" aria-hidden />

            <ul className="grid grid-cols-1 gap-2">
              {moreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-4 rounded-2xl bg-slate-50 px-4 py-3 active:scale-[0.98] active:bg-slate-100"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-brand-600 shadow-card">
                      <Icon name={link.icon} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-slate-900">{link.label}</span>
                      <span className="block text-xs text-slate-500">{link.hint}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <InstallAppButton variant="row" className="mt-3" />

            <div className="mt-4 border-t border-slate-200 pt-4">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    setMoreOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 py-3 text-sm font-semibold text-slate-700 active:bg-slate-100"
                >
                  <Icon name="logout" className="h-5 w-5" />
                  Sign out
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    className="rounded-2xl border border-slate-300 py-3 text-center text-sm font-semibold text-slate-700 active:bg-slate-100"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-2xl bg-brand-gradient py-3 text-center text-sm font-semibold text-white active:opacity-90"
                  >
                    Create account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      >
        <ul className="grid grid-cols-5">
          {TABS.map((tab) => {
            const active = isActive(pathname, tab.href);
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className="flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium active:scale-95"
                >
                  <span
                    className={cn(
                      "grid h-8 w-14 place-items-center rounded-full transition-colors",
                      active ? "bg-brand-100 text-brand-700" : "text-slate-500",
                    )}
                  >
                    <Icon name={tab.icon} className="h-[22px] w-[22px]" />
                  </span>
                  <span className={active ? "text-brand-700" : "text-slate-500"}>{tab.label}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((value) => !value)}
              className="flex w-full flex-col items-center gap-0.5 py-2 text-[11px] font-medium active:scale-95"
            >
              <span
                className={cn(
                  "grid h-8 w-14 place-items-center rounded-full transition-colors",
                  moreOpen || moreActive ? "bg-brand-100 text-brand-700" : "text-slate-500",
                )}
              >
                <Icon name="grid" className="h-[22px] w-[22px]" />
              </span>
              <span className={moreOpen || moreActive ? "text-brand-700" : "text-slate-500"}>
                More
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
