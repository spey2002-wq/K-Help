"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import api, { errorMessage } from "@/lib/api";
import type { Guide, GuideCategory, PageResponse } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/Feedback";
import { Pagination } from "@/components/ui/Pagination";
import { humanize, timeAgo } from "@/lib/utils";

const CATEGORIES: GuideCategory[] = [
  "VISA_IMMIGRATION",
  "HEALTHCARE",
  "BANKING",
  "HOUSING",
  "EMPLOYMENT",
  "EDUCATION",
  "EMERGENCY",
  "TRANSPORTATION",
  "DAILY_LIFE",
];

export default function InfoPage() {
  const [guides, setGuides] = useState<PageResponse<Guide> | null>(null);
  const [page, setPage] = useState(0);
  const [category, setCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setGuides(
        await api.info.list({
          page,
          size: 12,
          category: category || undefined,
          q: query || undefined,
        }),
      );
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, category, query]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Korea Living Guides</h1>
        <p className="mt-1 text-sm text-slate-600">
          Practical, curated information for visas, healthcare, banking, housing and emergencies.
        </p>
      </div>

      <div className="card flex flex-wrap items-end gap-3 p-4">
        <Input
          label="Search guides"
          className="min-w-[220px] flex-1"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              setPage(0);
              setQuery(searchInput.trim());
            }
          }}
          placeholder="e.g. ARC, bank account, health insurance"
        />
        <Select
          label="Topic"
          className="w-56"
          value={category}
          onChange={(event) => {
            setPage(0);
            setCategory(event.target.value);
          }}
        >
          <option value="">All topics</option>
          {CATEGORIES.map((value) => (
            <option key={value} value={value}>
              {humanize(value)}
            </option>
          ))}
        </Select>
        <Button
          variant="outline"
          onClick={() => {
            setPage(0);
            setQuery(searchInput.trim());
          }}
        >
          Search
        </Button>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}

      {loading ? (
        <LoadingState message="Loading guides..." />
      ) : !guides || guides.content.length === 0 ? (
        <EmptyState
          title="No guides found"
          description="Try a different topic or search term."
        />
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {guides.content.map((guide) => (
              <Link
                key={guide.id}
                href={`/info/${guide.id}`}
                className="card card-hover flex flex-col p-5"
              >
                <Badge tone="brand" className="self-start">
                  {humanize(guide.category)}
                </Badge>
                <h2 className="mt-3 font-semibold leading-snug text-slate-900">
                  {guide.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {guide.summary}
                </p>
                <p className="mt-4 text-xs text-slate-500">
                  Updated {timeAgo(guide.updatedAt)} · {guide.viewCount} views
                </p>
              </Link>
            ))}
          </div>

          <Pagination page={guides.page} totalPages={guides.totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
