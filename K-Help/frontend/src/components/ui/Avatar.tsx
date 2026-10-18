"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

/** Blob URLs of protected images already downloaded in this session, keyed by API path. */
const blobCache = new Map<string, string>();

/** Must run on sign-out so the next member on a shared browser never sees cached photos. */
export function clearImageCache() {
  blobCache.forEach((url) => URL.revokeObjectURL(url));
  blobCache.clear();
}

const REMOTE_URL = /^https?:\/\//i;
const PROTECTED_PATH = /^\/api\/profile\/photos\/\d+\/image$/;

/**
 * Resolves an image source to something an <img> can show.
 * API photo paths need the member's token, so they are fetched as blobs; the token is
 * never sent to any other address.
 */
export function useImageSource(src?: string | null): string | null {
  const [url, setUrl] = useState<string | null>(() => {
    if (!src) return null;
    if (REMOTE_URL.test(src)) return src;
    return blobCache.get(src) ?? null;
  });

  useEffect(() => {
    if (!src) {
      setUrl(null);
      return;
    }
    if (REMOTE_URL.test(src)) {
      setUrl(src);
      return;
    }
    if (!PROTECTED_PATH.test(src)) {
      setUrl(null);
      return;
    }
    const cached = blobCache.get(src);
    if (cached) {
      setUrl(cached);
      return;
    }

    let cancelled = false;
    setUrl(null);
    api.profile
      .imageBlob(src)
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        blobCache.set(src, objectUrl);
        if (!cancelled) setUrl(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setUrl(null);
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  return url;
}

/** An <img> for a protected or remote image; renders a neutral placeholder while loading. */
export function ProtectedImage({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const resolved = useImageSource(src);
  if (!resolved) {
    return <div className={cn("animate-pulse bg-slate-200", className)} aria-label={alt} />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={resolved} alt={alt} className={className} />;
}

function initialsOf(user: Pick<User, "fullName" | "username">): string {
  const source = (user.fullName || user.username || "?").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  const letters =
    parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : source.slice(0, 2);
  return letters.toUpperCase();
}

/** Round profile picture, falling back to the member's initials on the brand gradient. */
export function Avatar({
  user,
  className,
}: {
  user: Pick<User, "fullName" | "username" | "profileImageUrl">;
  /** Sizing and text classes, e.g. "h-8 w-8 text-xs". */
  className?: string;
}) {
  const resolved = useImageSource(user.profileImageUrl);
  const base = "inline-grid shrink-0 place-items-center overflow-hidden rounded-full";

  if (resolved) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolved}
        alt={user.fullName || user.username}
        className={cn(base, "object-cover", className)}
      />
    );
  }
  return (
    <span
      className={cn(base, "bg-brand-gradient font-semibold text-white", className)}
      aria-label={user.fullName || user.username}
    >
      {initialsOf(user)}
    </span>
  );
}
