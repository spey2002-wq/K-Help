import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
}

export function Input({
  label,
  hint,
  error,
  className,
  id,
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const inputId = id ?? props.name;
  return (
    <div className={className}>
      {label && (
        <label className="label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn("input", error && "border-red-500 focus:ring-red-500")}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

export function Textarea({
  label,
  hint,
  error,
  className,
  id,
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const inputId = id ?? props.name;
  return (
    <div className={className}>
      {label && (
        <label className="label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn("input min-h-[120px] resize-y", error && "border-red-500")}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

export function Select({
  label,
  hint,
  error,
  className,
  id,
  children,
  ...props
}: FieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const inputId = id ?? props.name;
  return (
    <div className={className}>
      {label && (
        <label className="label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <select id={inputId} className={cn("input", error && "border-red-500")} {...props}>
        {children}
      </select>
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}
