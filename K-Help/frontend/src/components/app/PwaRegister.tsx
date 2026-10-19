"use client";

import { useEffect } from "react";
import { startInstallListener } from "@/lib/install-prompt";

/** Registers the service worker (production only) and starts watching for the install prompt. */
export function PwaRegister() {
  useEffect(() => {
    startInstallListener();

    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // The app still works without offline support.
    });
  }, []);

  return null;
}
