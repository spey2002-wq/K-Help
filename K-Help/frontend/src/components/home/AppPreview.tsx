import { cn } from "@/lib/utils";

const TILES = [
  { icon: "📘", label: "Guides", sub: "10 topics" },
  { icon: "💼", label: "Jobs", sub: "Filters" },
  { icon: "🏠", label: "Housing", sub: "Deposit & rent" },
  { icon: "🤖", label: "AI help", sub: "Translate" },
];

function FloatingChip({
  className,
  delay,
  icon,
  children,
}: {
  className: string;
  delay: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute flex animate-float items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-card-hover ring-1 ring-slate-100 motion-reduce:animate-none",
        className,
      )}
      style={{ animationDelay: delay }}
    >
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-50 text-base">{icon}</span>
      {children}
    </div>
  );
}

/** A small phone showing what the app looks like. Purely decorative. */
export function AppPreview() {
  return (
    <div className="relative mx-auto h-[490px] w-full max-w-[340px] sm:h-[470px]" aria-hidden>
      {/* soft glow behind the phone */}
      <div className="absolute inset-x-6 top-10 h-64 rounded-full bg-brand-300/40 blur-3xl" />

      <div className="relative mx-auto mt-10 h-[420px] w-[230px] rounded-[2.4rem] sm:mt-0 sm:h-full bg-white p-2 shadow-[0_30px_60px_-20px_rgb(47_86_224/0.45)] ring-1 ring-slate-200">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[1.9rem] bg-paper">
          {/* app bar */}
          <div className="flex items-center justify-between bg-white px-4 pb-2 pt-4">
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-lg bg-brand-gradient text-[11px] font-bold text-white">
                K
              </span>
              <span className="text-xs font-bold text-slate-900">K-Help</span>
            </div>
            <span className="h-6 w-6 rounded-full bg-brand-100" />
          </div>

          <div className="flex-1 space-y-3 px-3 pt-3">
            {/* welcome card */}
            <div className="rounded-2xl bg-brand-gradient p-3 text-white shadow-soft">
              <p className="text-[10px] font-medium text-brand-100">Welcome</p>
              <p className="mt-0.5 text-sm font-bold leading-tight">Settle into Korea with confidence</p>
              <div className="mt-2 h-6 rounded-lg bg-white/20" />
            </div>

            {/* tiles */}
            <div className="grid grid-cols-2 gap-2">
              {TILES.map((tile) => (
                <div key={tile.label} className="rounded-xl bg-white p-2.5 shadow-card ring-1 ring-slate-100">
                  <span className="text-lg">{tile.icon}</span>
                  <p className="mt-1 text-[11px] font-bold text-slate-900">{tile.label}</p>
                  <p className="text-[9px] text-slate-500">{tile.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* tab bar */}
          <div className="mt-2 flex items-center justify-around border-t border-slate-100 bg-white px-2 py-2.5">
            {[true, false, false, false, false].map((active, index) => (
              <span
                key={index}
                className={cn("h-1.5 rounded-full", active ? "w-6 bg-brand-500" : "w-3 bg-slate-200")}
              />
            ))}
          </div>
        </div>
      </div>

      <FloatingChip className="left-0 top-0 sm:-left-6 sm:top-14" delay="0s" icon="🛂">
        Visa guide ready
      </FloatingChip>
      <FloatingChip className="-right-6 top-52 hidden sm:flex" delay="1.2s" icon="💼">
        New job listings
      </FloatingChip>
      <FloatingChip className="bottom-0 right-0 sm:-left-8 sm:bottom-12 sm:right-auto" delay="2.2s" icon="🔤">
        Notice translated
      </FloatingChip>
    </div>
  );
}
