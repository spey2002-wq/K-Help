"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import api, { errorMessage } from "@/lib/api";
import type { Guide } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { ErrorState, LoadingState } from "@/components/ui/Feedback";
import { humanize, timeAgo } from "@/lib/utils";

export default function GuideDetailPage() {
  const params = useParams<{ id: string }>();
  const guideId = Number(params.id);

  const [guide, setGuide] = useState<Guide | null>(null);
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

  if (loading) return <LoadingState message="Loading guide..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!guide) return null;

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <Link href="/info" className="text-sm text-brand-600 hover:underline">
        ← Back to guides
      </Link>

      <div className="card p-8">
        <Badge tone="brand">{humanize(guide.category)}</Badge>

        <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900">{guide.title}</h1>

        <p className="mt-3 text-slate-600">{guide.summary}</p>

        <p className="mt-3 text-xs text-slate-500">
          Updated {timeAgo(guide.updatedAt)} · {guide.viewCount} views
        </p>

        <div className="mt-8 whitespace-pre-wrap leading-relaxed text-slate-700">
          {guide.content}
        </div>

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
    </article>
  );
}
