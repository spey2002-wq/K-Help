"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import api, { errorMessage } from "@/lib/api";
import type { Guide } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { ErrorState, LoadingState } from "@/components/ui/Feedback";
import { BankDirectory } from "@/components/info/BankDirectory";
import { LinkedContent } from "@/components/info/LinkedContent";
import { guideCategoryLabel, timeAgo } from "@/lib/utils";

export default function GuideDetailPage() {
  const params = useParams<{ id: string }>();
  const guideId = Number(params.id);

  const [guide, setGuide] = useState<Guide | null>(null);
  const [related, setRelated] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setGuide(await api.info.get(guideId));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [guideId]);

  useEffect(() => {
    if (!Number.isNaN(guideId)) void load();
  }, [load, guideId]);

  // Other guides on the same topic (and country, for visa guides).
  const category = guide?.category;
  const country = guide?.country;
  useEffect(() => {
    if (!category) return;
    let cancelled = false;
    api.info
      .list({ category, country: country || undefined, size: 7 })
      .then((result) => {
        if (!cancelled) {
          setRelated(result.content.filter((item) => item.id !== guideId).slice(0, 4));
        }
      })
      .catch(() => {
        if (!cancelled) setRelated([]);
      });
    return () => {
      cancelled = true;
    };
  }, [category, country, guideId]);

  if (loading) return <LoadingState message="Loading guide..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!guide) return null;

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <Link href="/info" className="text-sm text-brand-600 hover:underline">
        ← Back to guides
      </Link>

      <div className="card p-8">
        <div className="flex flex-wrap gap-2">
          <Badge tone="brand">{guideCategoryLabel(guide.category)}</Badge>
          {guide.country && <Badge tone="slate">{guide.country}</Badge>}
        </div>

        <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900">{guide.title}</h1>

        <p className="mt-3 text-slate-600">{guide.summary}</p>

        <p className="mt-3 text-xs text-slate-500">
          Updated {timeAgo(guide.updatedAt)} · {guide.viewCount} views
        </p>

        <div className="mt-8 whitespace-pre-wrap leading-relaxed text-slate-700">
          <LinkedContent text={guide.content ?? ""} />
        </div>

        <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          {guide.category === "VISA_BY_COUNTRY"
            ? "Visa rules, fees and eligible countries change. This guide is a summary only. Always confirm the current requirements with the Korean embassy or consulate in your country and the official sources below."
            : "Rules, fees and phone numbers change. This guide is a summary to help you get started. Confirm the current details with the official source below or the relevant office before you act."}
        </p>

        {guide.sourceUrl && (
          <div className="mt-8 border-t border-slate-200 pt-5">
            <a
              href={guide.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-brand-600 hover:underline"
            >
              Official source ↗
            </a>
          </div>
        )}
      </div>

      {guide.category === "BANKING" && <BankDirectory compact />}

      {related.length > 0 && (
        <section aria-labelledby="related-guides">
          <h2 id="related-guides" className="mb-3 font-semibold text-slate-900">
            More in {guideCategoryLabel(guide.category)}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/info/${item.id}`}
                className="card card-hover block p-4"
              >
                <p className="font-medium leading-snug text-slate-900">{item.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{item.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
