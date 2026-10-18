import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ChipProps {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

/** Rounded toggle button used for categories, days and quick filters. */
export function Chip({ selected, onClick, children, className }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
        selected
          ? "border-brand-600 bg-brand-600 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
        className,
      )}
    >
      {children}
    </button>
  );
}
