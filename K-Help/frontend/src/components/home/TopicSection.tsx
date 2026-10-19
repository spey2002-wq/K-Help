import Link from "next/link";
import type { Topic } from "@/lib/home-content";
import { cn } from "@/lib/utils";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
      className={cn("mt-0.5 h-5 w-5 shrink-0", className)}
    >
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

interface TopicSectionProps {
  topic: Topic;
  index: number;
}

export function TopicSection({ topic, index }: TopicSectionProps) {
  const { tone } = topic;
  const detailed = topic.topics.some((item) => item.description);

  return (
    <section id={topic.id} className="scroll-mt-24" aria-labelledby={`${topic.id}-title`}>
      <div className="card overflow-hidden">
        <div className="grid lg:grid-cols-5">
          {/* Left: what it is */}
          <div className={cn("flex flex-col p-8 lg:col-span-2", tone.soft)}>
            <div className="flex items-center gap-3">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-3xl shadow-card emoji-mono">
                {topic.icon}
              </span>
              <span className={cn("text-sm font-bold tabular-nums text-accent-600")}>
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <p className={cn("mt-5 text-xs font-semibold uppercase tracking-wider", tone.text)}>
              {topic.eyebrow}
            </p>
            <h3
              id={`${topic.id}-title`}
              className="mt-1 text-2xl font-bold tracking-tight text-slate-900"
            >
              {topic.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{topic.summary}</p>
            <Link
              href={topic.href}
              className={cn(
                "mt-6 inline-flex w-fit items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold shadow-card transition hover:shadow-card-hover",
                tone.text,
              )}
            >
              {topic.cta}
              <span aria-hidden>→</span>
            </Link>
          </div>

          {/* Right: highlights + main topics */}
          <div className="space-y-7 p-8 lg:col-span-3">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Highlights
              </h4>
              <ul className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {topic.highlights.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-relaxed text-slate-700">
                    <CheckIcon className={tone.text} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                {topic.topicsTitle}
              </h4>

              {detailed ? (
                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                  {topic.topics.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex h-full gap-3 rounded-xl border bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-card-hover",
                          tone.border,
                        )}
                      >
                        <span
                          className={cn(
                            "emoji-mono grid h-9 w-9 shrink-0 place-items-center rounded-lg text-lg",
                            tone.soft,
                          )}
                        >
                          {item.icon}
                        </span>
                        <span>
                          <span
                            className={cn(
                              "block text-sm font-semibold text-slate-900 group-hover:underline",
                            )}
                          >
                            {item.label}
                          </span>
                          {item.description && (
                            <span className="mt-0.5 block text-xs leading-relaxed text-slate-600">
                              {item.description}
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {topic.topics.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition",
                          tone.pill,
                        )}
                      >
                        {item.icon && (
                          <span aria-hidden className="emoji-mono">
                            {item.icon}
                          </span>
                        )}
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
