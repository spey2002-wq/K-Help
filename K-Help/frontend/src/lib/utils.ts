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

/** Renders a salary range such as "₩10,000 - ₩12,000 / hour". */
export function formatSalaryRange(min?: number | null, max?: number | null): string {
  if (min == null && max == null) return "Negotiable";
  if (min != null && max != null) return `${formatKrw(min)} - ${formatKrw(max)}`;
  return formatKrw(min ?? max);
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

/** Converts an enum-like value such as VISA_IMMIGRATION into "Visa Immigration". */
export function humanize(value?: string | null): string {
  if (!value) return "";
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
