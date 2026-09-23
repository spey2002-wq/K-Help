"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

/** Simple previous/next pager matching Spring Data's zero-based page numbers. */
export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-center gap-2 pt-6"
      aria-label="Pagination"
    >
      <PagerButton disabled={page === 0} onClick={() => onChange(page - 1)}>
        Previous
      </PagerButton>

      <span className="px-3 text-sm text-slate-600">
        Page {page + 1} of {totalPages}
      </span>

      <PagerButton disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)}>
        Next
      </PagerButton>
    </nav>
  );
}

function PagerButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700",
        "hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
