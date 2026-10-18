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
import { Chip } from "@/components/jobs/Chip";
import { BankDirectory } from "@/components/info/BankDirectory";
import { guideCategoryLabel, timeAgo } from "@/lib/utils";

const VISA_BY_COUNTRY: GuideCategory = "VISA_BY_COUNTRY";

const CATEGORIES: GuideCategory[] = [
  "VISA_IMMIGRATION",
  VISA_BY_COUNTRY,
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
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState<string[]>([]);
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
          country: category === VISA_BY_COUNTRY && country ? country : undefined,
          q: query || undefined,
        }),
      );
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, category, country, query]);

  useEffect(() => {
    void load();
  }, [load]);

  // Deep links such as /info?category=EMPLOYMENT preselect a topic.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("category");
    if (requested && (CATEGORIES as string[]).includes(requested)) {
      setCategory(requested);
    }
  }, []);

  useEffect(() => {
    api.info
      .countries()
      .then(setCountries)
      .catch(() => setCountries([]));
  }, []);

  const showCountryFilter = category === VISA_BY_COUNTRY;

  function chooseCategory(value: string) {
    setPage(0);
    setCategory(value);
    setCountry("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Korea Living Guides</h1>
        <p className="mt-1 text-sm text-slate-600">
          Practical, curated information for visas, jobs, education, healthcare, banking, housing, transport and emergencies.
        </p>
      </div>

      {!showCountryFilter && (
        <button
          type="button"
          onClick={() => chooseCategory(VISA_BY_COUNTRY)}
          className="card card-hover flex w-full flex-wrap items-center justify-between gap-3 border-brand-200 bg-brand-50/60 p-4 text-left"
        >
          <span>
            <span className="block font-semibold text-slate-900">
              Coming to Korea? Find the visa process for your country
            </span>
            <span className="mt-0.5 block text-sm text-slate-600">
              Visa types, documents and step-by-step guidance by nationality.
            </span>
          </span>
          <span className="text-sm font-medium text-brand-600">View visa guides →</span>
        </button>
      )}

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

        {showCountryFilter && (
          <Select
            label="Your country"
            className="w-56"
            value={country}
            onChange={(event) => {
              setPage(0);
              setCountry(event.target.value);
            }}
          >
            <option value="">All countries</option>
            {countries.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
        )}
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

      <div
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
        role="group"
        aria-label="Guide topics"
      >
        <Chip selected={category === ""} onClick={() => chooseCategory("")}>
          All topics
        </Chip>
        {CATEGORIES.map((value) => (
          <Chip key={value} selected={category === value} onClick={() => chooseCategory(value)}>
            {guideCategoryLabel(value)}
          </Chip>
        ))}
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
                <div className="flex flex-wrap gap-2 self-start">
                  <Badge tone="brand">{guideCategoryLabel(guide.category)}</Badge>
                  {guide.country && <Badge tone="slate">{guide.country}</Badge>}
                </div>
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

      {category === "BANKING" && <BankDirectory />}
    </div>
  );
}
