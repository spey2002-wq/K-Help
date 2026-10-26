"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/community", label: "Community" },
  { href: "/info", label: "Guides" },
  { href: "/jobs", label: "Jobs" },
  { href: "/housing", label: "Housing" },
  { href: "/chat", label: "Chat" },
  { href: "/ai", label: "AI Assistant" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout, loading } = useAuth();

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
              {link.label}
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
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {loading ? null : isAuthenticated ? (
            <>
              {user && (
                <Link
                  href="/profile"
                  title="My profile"
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
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Phone: compact app bar. Everything else lives in the bottom tab bar. */}
        <div className="flex items-center md:hidden">
          {loading ? null : isAuthenticated && user ? (
            <Link href="/profile" aria-label="My profile" className="rounded-full active:scale-95">
              <Avatar user={user} className="h-9 w-9 text-sm ring-2 ring-white" />
            </Link>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="outline">
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </div>    </header>
  );
}
