import type { Metadata } from "next";
import Link from "next/link";
import {
  ALSO_CONNECTS,
  ARCHITECTURE,
  FOLDERS,
  LAYERS,
  REQUEST_FLOW,
} from "@/lib/tech-content";

export const metadata: Metadata = {
  title: "How K-Help is built",
  description:
    "The technologies behind K-Help: frontend, backend, database, cache, security, AI and deployment.",
};

export default function TechPage() {
  return (
    <div className="space-y-12">
      {/* Intro */}
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
          Behind the app
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          How K-Help is built
        </h1>
        <p className="mt-3 text-slate-600">
          K-Help is a full-stack web app. A Next.js website talks to a Spring Boot API, which stores
          data in PostgreSQL and keeps popular data in Redis. This page explains each part in plain
          words and what it does in the project.
        </p>
      </header>

      {/* Architecture */}
      <section aria-labelledby="arch-title">
        <h2 id="arch-title" className="text-xl font-bold tracking-tight text-slate-900">
          The big picture
        </h2>
        <ol className="mt-5 grid gap-3 md:grid-cols-4">
          {ARCHITECTURE.map((node, index) => (
            <li key={node.title} className="relative">
              <div className="card flex h-full items-center gap-3 p-4">
                <span className="emoji-mono text-2xl" aria-hidden>
                  {node.icon}
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{node.title}</p>
                  <p className="text-sm text-slate-600">{node.detail}</p>
                </div>
              </div>
              {index < ARCHITECTURE.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-brand-600 px-1.5 text-xs leading-5 text-white md:-right-3.5 md:bottom-auto md:left-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-0"
                >
                  <span className="md:hidden">↓</span>
                  <span className="hidden md:inline">→</span>
                </span>
              )}
            </li>
          ))}
        </ol>
        <ul className="mt-5 flex flex-wrap gap-2">
          {ALSO_CONNECTS.map((text) => (
            <li
              key={text}
              className="badge bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100"
            >
              {text}
            </li>
          ))}
        </ul>
      </section>

      {/* Jump list */}
      <nav aria-label="Sections" className="-mx-1 flex flex-wrap gap-2">
        {LAYERS.map((layer) => (
          <a
            key={layer.id}
            href={`#${layer.id}`}
            className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
          >
            {layer.title}
          </a>
        ))}
        <a
          href="#flow"
          className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
        >
          Request flow
        </a>
      </nav>

      {/* Layers */}
      <div className="space-y-6">
        {LAYERS.map((layer) => (
          <section
            key={layer.id}
            id={layer.id}
            aria-labelledby={`${layer.id}-title`}
            className="card scroll-mt-24 p-5 sm:p-7"
          >
            <div className="flex items-start gap-4">
              <span className="emoji-mono text-3xl" aria-hidden>
                {layer.icon}
              </span>
              <div className="min-w-0">
                <h2
                  id={`${layer.id}-title`}
                  className="text-xl font-bold tracking-tight text-slate-900"
                >
                  {layer.title}
                </h2>
                <p className="mt-1 text-slate-600">{layer.summary}</p>
                {layer.where && (
                  <p className="mt-2 text-xs text-slate-500">
                    In the project: <code className="rounded bg-slate-100 px-1.5 py-0.5">{layer.where}</code>
                  </p>
                )}
              </div>
            </div>

            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {layer.items.map((item) => (
                <li
                  key={item.name}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                >
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.role}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* Request flow */}
      <section id="flow" aria-labelledby="flow-title" className="scroll-mt-24">
        <h2 id="flow-title" className="text-xl font-bold tracking-tight text-slate-900">
          What happens when you search for a job
        </h2>
        <p className="mt-1 text-slate-600">
          One tap touches almost every layer. This is the journey of a single request.
        </p>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {REQUEST_FLOW.map((item) => (
            <li key={item.step} className="card p-4">
              <p className="font-semibold text-brand-700">{item.step}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 [overflow-wrap:anywhere]">
                {item.detail}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Folder map */}
      <section aria-labelledby="folders-title">
        <h2 id="folders-title" className="text-xl font-bold tracking-tight text-slate-900">
          Where things live
        </h2>
        <div className="card mt-5 divide-y divide-slate-100">
          {FOLDERS.map((folder) => (
            <div key={folder.path} className="flex flex-col gap-1 p-4 sm:flex-row sm:gap-6">
              <code className="shrink-0 text-sm font-semibold text-slate-800 sm:w-80 [overflow-wrap:anywhere]">
                {folder.path}
              </code>
              <p className="text-sm text-slate-600">{folder.note}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="card flex flex-col items-start justify-between gap-3 p-6 sm:flex-row sm:items-center">
        <p className="text-slate-700">
          Want to see it in action? Start with the living guides or try the AI assistant.
        </p>
        <div className="flex gap-2">
          <Link
            href="/info"
            className="inline-flex items-center rounded-xl bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
          >
            Open guides
          </Link>
          <Link
            href="/ai"
            className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            AI assistant
          </Link>
        </div>
      </div>
    </div>
  );
}
