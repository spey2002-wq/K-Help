import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "brand" | "green" | "amber" | "red" | "slate" | "purple";

const TONES: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  slate: "bg-slate-100 text-slate-700",
  purple: "bg-purple-50 text-purple-700",
};

export function Badge({
  tone = "slate",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return <span className={cn("badge", TONES[tone], className)}>{children}</span>;
}

/** Maps a listing/application status to a sensible badge tone. */
export function statusTone(status?: string): Tone {
  switch (status) {
    case "APPROVED":
    case "AVAILABLE":
    case "ACCEPTED":
    case "RESOLVED":
    case "COMPLETED":
      return "green";
    case "PENDING":
    case "SUBMITTED":
    case "REVIEWING":
    case "NEW":
    case "SHORTLISTED":
    case "INTERVIEW":
    case "VIEWING_SCHEDULED":
      return "amber";
    case "REJECTED":
    case "DECLINED":
      return "red";
    case "CLOSED":
    case "RENTED":
    case "WITHDRAWN":
      return "slate";
    default:
      return "brand";
  }
}
