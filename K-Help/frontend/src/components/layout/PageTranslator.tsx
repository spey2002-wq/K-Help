"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "@/lib/i18n/locale-context";
import {
  clearGoogTransCookie,
  googleCodeFor,
  readGoogTransCookie,
  setGoogTransCookie,
} from "@/lib/i18n/google-locale";
import type { LocaleCode } from "@/lib/i18n/locales";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          options: { pageLanguage: string; autoDisplay: boolean; includedLanguages: string },
          elementId: string,
        ) => void;
      };
    };
  }
}

const SCRIPT_ID = "khelp-google-translate";

function includedLanguages(): string {
  return ["en", "ko", "zh-CN", "ja", "vi", "ne", "bn", "id", "th", "ru"].join(",");
}

function findCombo(): HTMLSelectElement | null {
  return document.querySelector<HTMLSelectElement>(".goog-te-combo");
}

function selectGoogleLanguage(code: string): boolean {
  const combo = findCombo();
  if (!combo) return false;
  const value = code === "en" ? "" : code;
  if (combo.value === value) return true;
  combo.value = value;
  combo.dispatchEvent(new Event("change"));
  return true;
}

function ensureHost() {
  if (document.getElementById("khelp-google-translate-element")) return;
  const el = document.createElement("div");
  el.id = "khelp-google-translate-element";
  el.setAttribute("aria-hidden", "true");
  el.style.display = "none";
  document.body.appendChild(el);
}

function ensureScript() {
  if (document.getElementById(SCRIPT_ID)) return;

  window.googleTranslateElementInit = () => {
    if (!window.google?.translate?.TranslateElement) return;
    // eslint-disable-next-line no-new
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        autoDisplay: false,
        includedLanguages: includedLanguages(),
      },
      "khelp-google-translate-element",
    );
  };

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.body.appendChild(script);
}

/**
 * Full-site translation via Google Translate, driven by the navbar globe.
 * English stays the source language so every page can be translated.
 */
export function PageTranslator() {
  const { locale, ready } = useLocale();
  const comboReady = useRef(false);
  const lastApplied = useRef<LocaleCode | null>(null);

  useEffect(() => {
    if (!ready) return;

    ensureHost();
    setGoogTransCookie(locale);
    ensureScript();

    const timer = window.setInterval(() => {
      if (!findCombo()) return;
      window.clearInterval(timer);
      comboReady.current = true;
      applyLocale(locale, false);
    }, 150);

    return () => window.clearInterval(timer);
    // bootstrap once preference is loaded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    if (!ready || !comboReady.current) return;
    if (lastApplied.current === locale) return;
    applyLocale(locale, true);
  }, [locale, ready]);

  function applyLocale(next: LocaleCode, fromUser: boolean) {
    const googleCode = googleCodeFor(next);
    const cookie = readGoogTransCookie();
    const expected = next === "en" ? null : `/en/${googleCode}`;

    if (next === "en") {
      const wasTranslated =
        Boolean(cookie) ||
        Boolean(document.querySelector("html.translated-ltr, html.translated-rtl"));
      clearGoogTransCookie();
      lastApplied.current = next;
      if (fromUser && wasTranslated) {
        window.location.reload();
        return;
      }
      selectGoogleLanguage("en");
      return;
    }

    setGoogTransCookie(next);
    lastApplied.current = next;

    if (selectGoogleLanguage(googleCode)) return;

    if (fromUser && cookie !== expected) {
      window.location.reload();
    }
  }

  return null;
}
