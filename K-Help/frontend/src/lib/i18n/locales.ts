export type LocaleCode =
  | "en"
  | "ko"
  | "zh"
  | "ja"
  | "vi"
  | "ne"
  | "bn"
  | "id"
  | "th"
  | "ru";

export type { MessageKey } from "@/lib/i18n/messages";
export { translate, MESSAGES, EN } from "@/lib/i18n/messages";

export type LocaleOption = {
  code: LocaleCode;
  label: string;
  nativeLabel: string;
  flag: string;
};

export const LOCALES: LocaleOption[] = [
  { code: "en", label: "English", nativeLabel: "English", flag: "🇺🇸" },
  { code: "ko", label: "Korean", nativeLabel: "한국어", flag: "🇰🇷" },
  { code: "zh", label: "Chinese", nativeLabel: "中文", flag: "🇨🇳" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語", flag: "🇯🇵" },
  { code: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt", flag: "🇻🇳" },
  { code: "ne", label: "Nepali", nativeLabel: "नेपाली", flag: "🇳🇵" },
  { code: "bn", label: "Bengali", nativeLabel: "বাংলা", flag: "🇧🇩" },
  { code: "id", label: "Indonesian", nativeLabel: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "th", label: "Thai", nativeLabel: "ไทย", flag: "🇹🇭" },
  { code: "ru", label: "Russian", nativeLabel: "Русский", flag: "🇷🇺" },
];

export const DEFAULT_LOCALE: LocaleCode = "en";
export const LOCALE_STORAGE_KEY = "khelp-locale";

export function isLocaleCode(value: string): value is LocaleCode {
  return LOCALES.some((locale) => locale.code === value);
}
