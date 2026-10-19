"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface HomeCtaProps {
  /** "hero" sits on the navy gradient, "light" sits on a white surface. */
  tone?: "hero" | "light";
}

/** Call-to-action buttons that change once the visitor is signed in. */
export function HomeCta({ tone = "hero" }: HomeCtaProps) {
  const { isAuthenticated, loading } = useAuth();
  const onHero = tone === "hero";

  // Avoid flashing the wrong buttons while the session is being restored.
  if (loading) {
    return <div className="h-12" aria-hidden />;
  }

  const primary = isAuthenticated
    ? { href: "/community", label: "Go to the community" }
    : { href: "/register", label: "Create a free account" };

  const secondary = isAuthenticated
    ? { href: "/info", label: "Browse living guides" }
    : { href: "/login", label: "I already have an account" };

  return (
    <div className="flex flex-wrap gap-3">
      <Link href={primary.href}>
        <Button
          size="lg"
          className={cn(onHero && "!bg-white !bg-none !text-brand-700 hover:!bg-brand-50")}
        >
          {primary.label}
        </Button>
      </Link>
      <Link href={secondary.href}>
        <Button
          size="lg"
          variant="outline"
          className={cn(
            onHero && "border-white/40 bg-white/10 text-white hover:border-white/60 hover:bg-white/15",
          )}
        >
          {secondary.label}
        </Button>
      </Link>
    </div>
  );
}
