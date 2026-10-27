import clsx, { type ClassValue } from "clsx";

/** Conditional className helper. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** Formats a number as Korean Won, e.g. 550000 -> "₩550,000". */
export function formatKrw(value?: number | null): string {
  if (value == null) return "-";
  return `₩${value.toLocaleString("en-US")}`;
}

const PERIOD_SUFFIX: Record<string, string> = {
  HOURLY: "/ hour",
  MONTHLY: "/ month",
  YEARLY: "/ year",
};

/** Renders a salary range such as "₩10,000 - ₩12,000 / hour". */
export function formatSalaryRange(
  min?: number | null,
  max?: number | null,
  period?: string | null,
): string {
  if (min == null && max == null) return "Negotiable";
  const amount =
    min != null && max != null ? `${formatKrw(min)} - ${formatKrw(max)}` : formatKrw(min ?? max);
  const suffix = period ? PERIOD_SUFFIX[period] : undefined;
  return suffix ? `${amount} ${suffix}` : amount;
}

/** Short relative time such as "3h ago", falling back to a date for old items. */
export function timeAgo(iso?: string | null): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";

  const seconds = Math.floor((Date.now() - then) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Display label for a guide topic; falls back to the humanized enum value. */
export function guideCategoryLabel(value?: string | null): string {
  if (value === "VISA_BY_COUNTRY") return "Visa by Country";
  if (value === "VISA_IMMIGRATION") return "Visa & Immigration";
  return humanize(value);
}

/** Labels that need more than simple capitalization. */
const SPECIAL_LABELS: Record<string, string> = {
  VISA_IMMIGRATION: "Visa & Immigration",
  VISA_BY_COUNTRY: "Visa by Country",
};

/** Converts an enum-like value such as SHARE_HOUSE into "Share House". */
export function humanize(value?: string | null): string {
  if (!value) return "";
  if (SPECIAL_LABELS[value]) return SPECIAL_LABELS[value];
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
