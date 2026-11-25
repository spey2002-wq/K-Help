"use client";

import { useLocale } from "@/lib/i18n/locale-context";

export function SiteFooter() {
  const { t } = useLocale();

  return (
    <footer className="app-footer hidden border-t border-slate-200 bg-white md:block">
      <div className="container flex flex-col items-center justify-between gap-2 py-6 text-sm text-slate-500 sm:flex-row">
        <p className="font-medium text-slate-600">{t("footer.tagline")}</p>
        <p className="text-slate-400">{t("footer.team")}</p>
      </div>
    </footer>
  );
}
