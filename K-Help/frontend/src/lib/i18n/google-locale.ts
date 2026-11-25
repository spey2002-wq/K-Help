import type { LocaleCode } from "@/lib/i18n/locales";

/** Google Translate language codes (Chinese needs zh-CN). */
export const GOOGLE_LOCALE: Record<LocaleCode, string> = {
  en: "en",
  ko: "ko",
  zh: "zh-CN",
  ja: "ja",
  vi: "vi",
  ne: "ne",
  bn: "bn",
  id: "id",
  th: "th",
  ru: "ru",
};

export function googleCodeFor(locale: LocaleCode): string {
  return GOOGLE_LOCALE[locale] ?? "en";
}

/** Read current googtrans cookie value like "/en/ko". */
export function readGoogTransCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function clearGoogTransCookie() {
  if (typeof document === "undefined") return;
  const host = window.location.hostname;
  const expires = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `googtrans=;path=/;${expires}`;
  document.cookie = `googtrans=;path=/;domain=${host};${expires}`;
  document.cookie = `googtrans=;path=/;domain=.${host};${expires}`;
}

export function setGoogTransCookie(locale: LocaleCode) {
  if (typeof document === "undefined") return;
  if (locale === "en") {
    clearGoogTransCookie();
    return;
  }
  const value = `/en/${googleCodeFor(locale)}`;
  document.cookie = `googtrans=${value};path=/`;
}
