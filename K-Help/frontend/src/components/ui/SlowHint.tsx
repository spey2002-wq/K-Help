"use client";

import { useEffect, useState } from "react";

/**
 * Appears only when loading drags on. The free hosting plan puts the API to
 * sleep when idle, and the first request after that can take up to a minute.
 */
export function SlowHint({ afterMs = 6000 }: { afterMs?: number }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShow(true), afterMs);
    return () => window.clearTimeout(timer);
  }, [afterMs]);

  if (!show) return null;

  return (
    <p
      role="status"
      className="max-w-xs text-center text-xs leading-relaxed text-slate-400"
    >
      Waking up the server after a quiet period. This can take up to a minute, and it will be
      fast again afterwards.
    </p>
  );
}
