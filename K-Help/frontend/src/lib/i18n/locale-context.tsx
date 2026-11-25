"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  LOCALES,
  isLocaleCode,
  translate,
  type LocaleCode,
  type LocaleOption,
  type MessageKey,
} from "@/lib/i18n/locales";

type LocaleContextValue = {
  locale: LocaleCode;
  locales: LocaleOption[];
  setLocale: (code: LocaleCode) => void;
  t: (key: MessageKey) => string;
  current: LocaleOption;
  ready: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStoredLocale(): LocaleCode {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored && isLocaleCode(stored)) return stored;
  const browser = window.navigator.language.slice(0, 2).toLowerCase();
  if (isLocaleCode(browser)) return browser;
  return DEFAULT_LOCALE;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLocaleState(readStoredLocale());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale;
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale, ready]);

  const setLocale = useCallback((code: LocaleCode) => {
    setLocaleState(code);
  }, []);

  // Keep English as the source language in the DOM. PageTranslator (Google Translate)
  // then converts the whole site so every page updates, not only dictionary keys.
  const t = useCallback((key: MessageKey) => translate("en", key), []);

  const current = useMemo(
    () => LOCALES.find((item) => item.code === locale) ?? LOCALES[0],
    [locale],
  );

  const value = useMemo(
    () => ({ locale, locales: LOCALES, setLocale, t, current, ready }),
    [locale, setLocale, t, current, ready],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
