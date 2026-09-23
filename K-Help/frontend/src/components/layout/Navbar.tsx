"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/community", label: "Community" },
  { href: "/info", label: "Korea Info" },
  { href: "/jobs", label: "Jobs" },
  { href: "/housing", label: "Housing" },
  { href: "/chat", label: "Chat" },
  { href: "/ai", label: "AI Assistant" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-sm text-white">
            K
          </span>
          <span className="text-lg">K-Help</span>
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
                  ? "bg-purple-50 text-purple-700"
                  : "text-purple-600 hover:bg-purple-50",
              )}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {loading ? null : isAuthenticated ? (
            <>
              <span className="max-w-[140px] truncate text-sm text-slate-600">
                {user?.fullName || user?.username}
              </span>
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

        <button
          type="button"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="container flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50"
              >
                Admin
              </Link>
            )}
            <div className="mt-2 flex gap-2 border-t border-slate-200 pt-3">
              {isAuthenticated ? (
                <Button variant="outline" size="sm" onClick={logout} className="w-full">
                  Sign out
                </Button>
              ) : (
                <>
                  <Link href="/login" className="flex-1" onClick={() => setOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/register" className="flex-1" onClick={() => setOpen(false)}>
                    <Button size="sm" className="w-full">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
