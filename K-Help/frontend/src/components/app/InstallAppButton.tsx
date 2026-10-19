"use client";

import { useState } from "react";
import { promptInstall, useInstallState } from "@/lib/install-prompt";
import { Button } from "@/components/ui/Button";

interface InstallAppButtonProps {
  className?: string;
  /** Render as a full-width list row (used inside the More sheet). */
  variant?: "button" | "row";
}

/** Offers to install K-Help to the home screen when the browser allows it. */
export function InstallAppButton({ className, variant = "button" }: InstallAppButtonProps) {
  const state = useInstallState();
  const [showIosHelp, setShowIosHelp] = useState(false);

  if (state === "installed" || state === "unavailable") return null;

  async function handleClick() {
    if (state === "ios") {
      setShowIosHelp((value) => !value);
      return;
    }
    await promptInstall();
  }

  return (
    <div className={className}>
      {variant === "row" ? (
        <button
          type="button"
          onClick={handleClick}
          className="flex w-full items-center gap-3 rounded-2xl bg-brand-50 px-4 py-3 text-left text-sm font-semibold text-brand-700 active:scale-[0.98]"
        >
          <span className="text-lg" aria-hidden>
            📲
          </span>
          Install the K-Help app
        </button>
      ) : (
        <Button variant="outline" size="lg" onClick={handleClick}>
          📲 Install the app
        </Button>
      )}
      {showIosHelp && (
        <p className="mt-2 rounded-xl bg-slate-100 px-3 py-2 text-xs leading-relaxed text-slate-700">
          On iPhone or iPad: tap the <strong>Share</strong> button in Safari, then{" "}
          <strong>Add to Home Screen</strong>.
        </p>
      )}
    </div>
  );
}
