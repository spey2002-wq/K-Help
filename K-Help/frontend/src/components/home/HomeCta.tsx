"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getHomeCopy } from "@/lib/i18n/home-copy";
import { useLocale } from "@/lib/i18n/locale-context";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface HomeCtaProps {
  /** "hero" sits on the navy gradient, "light" sits on a white surface. */
  tone?: "hero" | "light";
}

/** Call-to-action buttons that change once the visitor is signed in. */
export function HomeCta({ tone = "hero" }: HomeCtaProps) {
  const { isAuthenticated, loading } = useAuth();
  const { locale } = useLocale();
  const copy = getHomeCopy(locale);
  const onHero = tone === "hero";

  if (loading) {
    return <div className="h-12" aria-hidden />;
  }

  const primary = isAuthenticated
    ? { href: "/community", label: copy.ctaCommunity }
    : { href: "/register", label: copy.ctaCreate };

  const secondary = isAuthenticated
    ? { href: "/info", label: copy.ctaGuides }
    : { href: "/login", label: copy.ctaHaveAccount };

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
