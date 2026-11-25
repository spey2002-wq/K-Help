"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/i18n/locale-context";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { cn } from "@/lib/utils";
import type { MessageKey } from "@/lib/i18n/locales";

const NAV_LINKS: { href: string; key: MessageKey }[] = [
  { href: "/community", key: "nav.community" },
  { href: "/info", key: "nav.guides" },
  { href: "/jobs", key: "nav.jobs" },
  { href: "/housing", key: "nav.housing" },
  { href: "/chat", key: "nav.chat" },
  { href: "/ai", key: "nav.ai" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout, loading } = useAuth();
  const { t } = useLocale();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="container flex h-14 items-center md:h-16 justify-between gap-4">
        <Link href="/" className="group flex items-center gap-2.5 font-bold text-slate-900">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient text-base font-bold text-white shadow-soft transition-transform group-hover:scale-105">
            K
          </span>
          <span className="text-lg tracking-tight">K-Help</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith(link.href)
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              {t(link.key)}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith("/admin")
                  ? "bg-accent-50 text-accent-600"
                  : "text-accent-600 hover:bg-accent-50",
              )}
            >
              {t("nav.admin")}
            </Link>
          )}
          {/* Language sits with nav links — always visible, not tied to Inbox */}
          <LanguageSwitcher className="ml-1" />
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {loading ? null : isAuthenticated ? (
            <>
              <Link
                href="/inbox"
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname.startsWith("/inbox")
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                {t("nav.inbox")}
              </Link>
              {user && (
                <Link
                  href="/profile"
                  title={t("nav.myProfile")}
                  className={cn(
                    "flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors",
                    pathname.startsWith("/profile")
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-700 hover:bg-slate-100",
                  )}
                >
                  <Avatar user={user} className="h-8 w-8 text-xs ring-2 ring-white" />
                  <span className="max-w-[140px] truncate text-sm font-medium">
                    {user.fullName || user.username}
                  </span>
                </Link>
              )}
              <Button variant="outline" size="sm" onClick={logout}>
                {t("nav.signOut")}
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  {t("nav.signIn")}
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">{t("nav.getStarted")}</Button>
              </Link>
            </>
          )}
        </div>

        {/* Phone: language + profile / sign in */}
        <div className="flex items-center gap-1 md:hidden">
          <LanguageSwitcher compact />
          {loading ? null : isAuthenticated && user ? (
            <Link href="/profile" aria-label={t("nav.myProfile")} className="rounded-full active:scale-95">
              <Avatar user={user} className="h-9 w-9 text-sm ring-2 ring-white" />
            </Link>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="outline">
                {t("nav.signIn")}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
