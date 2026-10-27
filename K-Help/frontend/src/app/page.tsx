import Link from "next/link";
import { InstallAppButton } from "@/components/app/InstallAppButton";
import { AppPreview } from "@/components/home/AppPreview";
import { HomeCta } from "@/components/home/HomeCta";
import { TopicSection } from "@/components/home/TopicSection";
import {
  AI_LANGUAGES,
  ALSO_INCLUDED,
  AUDIENCES,
  GUIDE_TOPIC_COUNT,
  JOB_CATEGORY_COUNT,
  QUICK_GOALS,
  STEPS,
  TOPICS,
} from "@/lib/home-content";

const STATS = [
  { value: String(TOPICS.length), label: "connected services" },
  { value: String(GUIDE_TOPIC_COUNT), label: "living-guide topics" },
  { value: String(JOB_CATEGORY_COUNT), label: "job categories" },
  { value: String(AI_LANGUAGES.length), label: "AI languages" },
];

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-wider text-accent-600">{eyebrow}</p>
      <h2 id={id} className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h2>
      {description && <p className="mt-3 leading-relaxed text-slate-600">{description}</p>}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-br from-white via-brand-50 to-brand-100/70 px-6 py-12 shadow-card sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-brand-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-accent-100/70 blur-3xl" />

        <div className="relative grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 shadow-card ring-1 ring-brand-100">
              <span className="h-2 w-2 rounded-full bg-accent-500" aria-hidden />
              Korea Life Platform for Foreign Residents
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                live in Korea
              </span>
              , in one app
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              Living guides, jobs, housing, community answers, real-time chat and an AI translator,
              so moving to Korea and settling in feels less confusing.
            </p>
            <div className="mt-8">
              <HomeCta tone="light" />
            </div>
            <ul className="mt-8 flex flex-wrap gap-2 text-sm text-slate-600">
              {["Free to use", "Works on your phone", "AI translation"].map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 ring-1 ring-brand-100"
                >
                  <span className="text-brand-600" aria-hidden>
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <AppPreview />
        </div>

        <dl className="relative mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white/80 p-4 shadow-card ring-1 ring-brand-100">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block text-3xl font-extrabold tabular-nums text-brand-700">
                  {stat.value}
                </span>
                <span className="text-sm text-slate-600">{stat.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Jump list */}
      <nav aria-label="Jump to a topic" className="-mt-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          What is inside
        </p>
        <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {TOPICS.map((topic) => (
            <li key={topic.id} className="shrink-0">
              <a
                href={`#${topic.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-card ring-1 ring-slate-200 transition hover:bg-brand-50 hover:text-brand-700 hover:ring-brand-200 active:scale-95"
              >
                <span aria-hidden>{topic.icon}</span>
                {topic.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {/* What is K-Help */}
      <section aria-labelledby="about-title" className="grid gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading
            id="about-title"
            eyebrow="About the app"
            title="What is K-Help?"
            description="Starting a life in Korea means dealing with visas, banks, rent deposits, work rules and a language you may not speak yet. The answers exist, but they are scattered across many websites and written for Koreans."
          />
          <p className="mt-4 leading-relaxed text-slate-600">
            K-Help puts the essentials together in one friendly place. Read plain-language guides,
            find jobs and rooms that fit your visa and budget, ask people who have already been
            through it, and use AI to read and write Korean. It is built for international
            students, workers and long-term residents.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Free to use. Create an account to post, chat and apply.",
              "Available in plain English, with AI help for other languages.",
              "Guides are a starting point. Always confirm important details with the official office.",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-slate-700">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Who it is for
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {AUDIENCES.map((audience) => (
              <div key={audience.title} className="card p-5">
                <span className="emoji-mono grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-xl">
                  {audience.icon}
                </span>
                <h4 className="mt-3 font-semibold text-slate-900">{audience.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {audience.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick goals */}
      <section aria-labelledby="goals-title">
        <SectionHeading
          id="goals-title"
          eyebrow="Start here"
          title="What do you want to do?"
          description="Pick the thing on your mind and go straight to the right page."
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_GOALS.map((goal) => (
            <li key={goal.label}>
              <Link href={goal.href} className="card card-hover group flex h-full gap-3 p-4">
                <span className="grid emoji-mono grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-xl transition-colors group-hover:bg-brand-100">
                  {goal.icon}
                </span>
                <span>
                  <span className="block font-semibold text-slate-900 group-hover:text-brand-700">
                    {goal.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">{goal.hint}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works */}
      <section aria-labelledby="steps-title">
        <SectionHeading
          id="steps-title"
          eyebrow="How it works"
          title="From arrival to settled in four steps"
        />
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="card relative p-6">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-gradient text-sm font-bold text-white shadow-soft">
                {index + 1}
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Topic highlights */}
      <section aria-labelledby="topics-title" className="space-y-8">
        <div>
          <SectionHeading
            id="topics-title"
            eyebrow="Highlights"
            title="Everything K-Help covers"
            description="Each service below lists its highlights and its main topics. Select any topic to open it directly."
          />
        </div>
        <div className="space-y-8">
          {TOPICS.map((topic, index) => (
            <TopicSection key={topic.id} topic={topic} index={index} />
          ))}
        </div>
      </section>

      {/* Also included */}
      <section aria-labelledby="extras-title">
        <SectionHeading id="extras-title" eyebrow="And more" title="Built to be trusted and easy to use" />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ALSO_INCLUDED.map((item) => (
            <li key={item.title} className="card p-5">
              <span className="emoji-mono text-2xl" aria-hidden>
                {item.icon}
              </span>
              <h3 className="mt-3 font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Final CTA + demo accounts */}
      <section className="grid gap-6 lg:grid-cols-5">
        <div className="card flex flex-col justify-center p-8 lg:col-span-3">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Ready to make Korea feel like home?
          </h2>
          <p className="mt-2 max-w-lg text-slate-600">
            Create your free account in under a minute and start with the guides that match your
            visa.
          </p>
          <div className="mt-6 space-y-3">
            <HomeCta tone="light" />
            <InstallAppButton />
            <p className="text-sm text-slate-500">
              Curious how it works?{" "}
              <Link href="/tech" className="font-semibold text-brand-700 hover:underline">
                See how K-Help is built →
              </Link>
            </p>
          </div>
        </div>

        <div className="card p-8 lg:col-span-2">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">Try the demo</h2>
          <p className="mt-1 text-sm text-slate-600">
            A sample member account is included so you can explore the app right away. It is a
            regular member account, so it can only change its own data.
          </p>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-700">Member</p>
              <p className="mt-0.5 font-mono text-sm text-slate-600">ashish / User@123</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
