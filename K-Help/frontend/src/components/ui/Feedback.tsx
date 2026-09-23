import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Centered spinner used while a page or panel is loading. */
export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600",
        className,
      )}
    />
  );
}

/** Full-width loading state for page-level fetches. */
export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
      <Spinner className="h-6 w-6" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

/** Empty state for lists with no results. */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <p className="font-medium text-slate-700">{title}</p>
      {description && <p className="max-w-md text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

/** Inline error panel with an optional retry action. */
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <p>{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 font-medium underline underline-offset-2"
        >
          Try again
        </button>
      )}
    </div>
  );
}
