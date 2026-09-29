import Link from "next/link";
import { Button } from "@/components/ui/Button";

const FEATURES = [
  {
    href: "/community",
    title: "Community",
    description:
      "Ask questions and share experience with other foreign residents, organized by category.",
    icon: "💬",
  },
  {
    href: "/info",
    title: "Korea Info",
    description:
      "Guides for visas, healthcare, banking, housing and emergency services, written for newcomers.",
    icon: "📘",
  },
  {
    href: "/jobs",
    title: "Jobs",
    description:
      "Foreigner-friendly listings with visa sponsorship and Korean-language filters.",
    icon: "💼",
  },
  {
    href: "/housing",
    title: "Housing",
    description:
      "Compare one-rooms, share houses and officetels by deposit, monthly rent and location.",
    icon: "🏠",
  },
  {
    href: "/chat",
    title: "Real-time Chat",
    description:
      "Message job posters and landlords directly with read receipts and history.",
    icon: "⚡",
  },
  {
    href: "/ai",
    title: "AI Assistant",
    description:
      "Translate Korean text, summarize official notices and write polite Korean messages.",
    icon: "🤖",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl bg-brand-gradient px-8 py-16 text-white shadow-soft sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-hero-shine" />
        <div className="relative max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
            Korea Life Platform for Foreign Residents
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Everything you need to live in Korea, in one place
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-indigo-100">
            Community discussions, practical living guides, foreigner-friendly jobs and housing,
            real-time messaging, and AI-powered translation — built for international students,
            workers and long-term residents.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register">
              <Button size="lg" className="hero-cta">
                Create an account
              </Button>
            </Link>
            <Link href="/info">
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/10 text-white hover:bg-white/15"
              >
                Browse living guides
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Platform modules</h2>
        <p className="mt-2 text-slate-600">
          Six connected services that take you from finding information to talking to people.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="card card-hover group p-6"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-2xl transition-colors group-hover:bg-brand-100">
                {feature.icon}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 group-hover:text-brand-700">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="card p-8">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Demo accounts</h2>
        <p className="mt-2 text-sm text-slate-600">
          Seeded by the database migration so you can explore every module immediately.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">Administrator</p>
            <p className="mt-1 font-mono text-sm text-slate-600">admin / Admin@123</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">Member</p>
            <p className="mt-1 font-mono text-sm text-slate-600">ashish / User@123</p>
          </div>
        </div>
      </section>
    </div>
  );
}
