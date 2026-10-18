"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import api, { errorMessage } from "@/lib/api";
import type { JobListing, JobSortOption, PageResponse } from "@/types";
import { useAuth } from "@/lib/auth-context";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/Feedback";
import { Pagination } from "@/components/ui/Pagination";
import { Chip } from "@/components/jobs/Chip";
import { JobFilterPanel } from "@/components/jobs/JobFilterPanel";
import { JobSearchBar } from "@/components/jobs/JobSearchBar";
import { formatSalaryRange, humanize, timeAgo } from "@/lib/utils";
import {
  CATEGORY_OPTIONS,
  SORT_OPTIONS,
  WEEKEND,
  categoryLabel,
  experienceLabel,
  formatWorkDays,
  shiftLabel,
  workPeriodLabel,
} from "@/lib/job-options";
import {
  EMPTY_FILTERS,
  activeFilterChips,
  countPanelFilters,
  hasAnyFilter,
  salaryRangeInvalid,
  toQueryParams,
  toggleItem,
  type JobFilters,
} from "@/lib/job-filters";

const SHORT_TERM = ["ONE_DAY", "UNDER_1_MONTH"] as const;

function sameSet(a: string[], b: readonly string[]): boolean {
  return a.length === b.length && b.every((item) => a.includes(item));
}

export default function JobsPage() {
  const { isAuthenticated } = useAuth();

  const [jobs, setJobs] = useState<PageResponse<JobListing> | null>(null);
  const [page, setPage] = useState(0);
  /** What the controls show right now. */
  const [filters, setFilters] = useState<JobFilters>(EMPTY_FILTERS);
  /** What the last search actually used. */
  const [applied, setApplied] = useState<JobFilters>(EMPTY_FILTERS);
  const [showPanel, setShowPanel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setJobs(await api.jobs.list({ ...toQueryParams(applied), page, size: 10 }));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, applied]);

  useEffect(() => {
    void load();
  }, [load]);

  /** Shows the new filters and searches with them straight away. */
  function commit(next: JobFilters) {
    if (salaryRangeInvalid(next)) return;
    setFilters(next);
    setApplied(next);
    setPage(0);
  }

  function clearAll() {
    commit({ ...EMPTY_FILTERS, sort: applied.sort });
  }

  function patch(partial: Partial<JobFilters>) {
    commit({ ...filters, ...partial });
  }

  const panelCount = countPanelFilters(filters);
  const chips = activeFilterChips(applied);
  const invalidRange = salaryRangeInvalid(filters);
  const payNeedsPeriod =
    (applied.sort === "PAY_HIGH" || applied.sort === "PAY_LOW") && applied.salaryPeriod === "";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Job Listings</h1>
          <p className="mt-1 text-sm text-slate-600">
            Foreigner-friendly opportunities, filtered by pay, days, hours and language needs.
          </p>
        </div>
        {isAuthenticated && (
          <Link href="/jobs/new">
            <Button>Post a job</Button>
          </Link>
        )}
      </div>

      <div className="card space-y-4 p-4">
        <JobSearchBar
          query={filters.q}
          location={filters.location}
          onQueryChange={(q) => setFilters((previous) => ({ ...previous, q }))}
          onLocationChange={(location) => patch({ location })}
          onSearch={(nextQuery) => patch(nextQuery !== undefined ? { q: nextQuery } : {})}
        />

        {/* Categories */}
        <div
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
          role="group"
          aria-label="Job categories"
        >
          <Chip selected={filters.categories.length === 0} onClick={() => patch({ categories: [] })}>
            All jobs
          </Chip>
          {CATEGORY_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              selected={filters.categories.includes(option.value)}
              onClick={() => patch({ categories: toggleItem(filters.categories, option.value) })}
            >
              {option.label}
            </Chip>
          ))}
        </div>

        {/* Quick filters */}
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Quick filters">
          <Chip selected={filters.urgent} onClick={() => patch({ urgent: !filters.urgent })}>
            Hiring now
          </Chip>
          <Chip
            selected={filters.koreanRequired === "false"}
            onClick={() => patch({ koreanRequired: filters.koreanRequired === "false" ? "" : "false" })}
          >
            No Korean needed
          </Chip>
          <Chip
            selected={filters.experienceLevel === "NO_EXPERIENCE"}
            onClick={() =>
              patch({ experienceLevel: filters.experienceLevel === "NO_EXPERIENCE" ? "" : "NO_EXPERIENCE" })
            }
          >
            Beginner friendly
          </Chip>
          <Chip
            selected={sameSet(filters.availableDays, WEEKEND)}
            onClick={() =>
              patch({ availableDays: sameSet(filters.availableDays, WEEKEND) ? [] : [...WEEKEND] })
            }
          >
            Weekend only
          </Chip>
          <Chip
            selected={sameSet(filters.workPeriods, SHORT_TERM)}
            onClick={() =>
              patch({ workPeriods: sameSet(filters.workPeriods, SHORT_TERM) ? [] : [...SHORT_TERM] })
            }
          >
            Short-term
          </Chip>
          <Chip
            selected={filters.mealsProvided}
            onClick={() => patch({ mealsProvided: !filters.mealsProvided })}
          >
            Meals provided
          </Chip>
          <Chip
            selected={filters.housingProvided}
            onClick={() => patch({ housingProvided: !filters.housingProvided })}
          >
            Housing
          </Chip>
          <Chip
            selected={filters.visaSponsorship}
            onClick={() => patch({ visaSponsorship: !filters.visaSponsorship })}
          >
            Visa sponsorship
          </Chip>

          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            aria-expanded={showPanel}
            onClick={() => setShowPanel((open) => !open)}
          >
            {showPanel ? "Hide filters" : "All filters"}
            {panelCount > 0 && (
              <span className="badge bg-brand-100 text-brand-700">{panelCount}</span>
            )}
          </Button>
        </div>

        {showPanel && (
          <>
            <JobFilterPanel filters={filters} onChange={setFilters} onApply={() => commit(filters)} />
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-4">
              <Button variant="ghost" onClick={clearAll} disabled={!hasAnyFilter(filters)}>
                Clear filters
              </Button>
              <Button onClick={() => commit(filters)} disabled={invalidRange}>
                Apply filters
              </Button>
            </div>
          </>
        )}

        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Active
            </span>
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 hover:bg-brand-100"
                onClick={() => commit(chip.remove(applied))}
                aria-label={`Remove filter ${chip.label}`}
              >
                {chip.label}
                <span aria-hidden="true">×</span>
              </button>
            ))}
            <button
              type="button"
              className="text-xs font-medium text-slate-500 underline hover:text-slate-700"
              onClick={clearAll}
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {error && <ErrorState message={error} onRetry={load} />}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600" aria-live="polite">
          {loading || !jobs
            ? "Searching..."
            : `${jobs.totalElements} ${jobs.totalElements === 1 ? "job" : "jobs"} found`}
        </p>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          Sort by
          <select
            className="input w-auto py-1.5"
            value={filters.sort}
            onChange={(event) => patch({ sort: event.target.value as JobSortOption })}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {payNeedsPeriod && (
        <p className="-mt-3 text-xs text-amber-700">
          Hourly and monthly pay are not comparable. Open All filters and choose Per hour or Per
          month to sort pay fairly.
        </p>
      )}

      {loading ? (
        <LoadingState message="Loading jobs..." />
      ) : !jobs || jobs.content.length === 0 ? (
        <EmptyState
          title="No jobs match your filters"
          description="Try removing a few filters or searching a different keyword."
          action={
            hasAnyFilter(applied) ? (
              <Button variant="outline" onClick={clearAll}>
                Clear all filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="space-y-3">
            {jobs.content.map((job) => {
              const perks = [
                job.mealsProvided && "Meals",
                job.housingProvided && "Housing",
                job.insuranceProvided && "Insurance",
                job.transportProvided && "Transport pay",
              ].filter(Boolean) as string[];

              const conditions = [
                shiftLabel(job.shift),
                job.hoursPerWeek ? `${job.hoursPerWeek} hrs/week` : "",
                formatWorkDays(job.workDays),
                workPeriodLabel(job.workPeriod),
                experienceLabel(job.experienceLevel),
              ].filter(Boolean);

              return (
                <article key={job.id} className="card card-hover p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap gap-2">
                        {job.urgent && <Badge tone="red">Hiring now</Badge>}
                        {job.category && <Badge tone="slate">{categoryLabel(job.category)}</Badge>}
                        <Badge tone="brand">{humanize(job.jobType)}</Badge>
                        {job.visaSponsorship && <Badge tone="green">Visa sponsorship</Badge>}
                        {!job.koreanRequired && <Badge tone="purple">No Korean needed</Badge>}
                        {job.status !== "APPROVED" && (
                          <Badge tone={statusTone(job.status)}>{humanize(job.status)}</Badge>
                        )}
                      </div>

                      <Link
                        href={`/jobs/${job.id}`}
                        className="text-lg font-semibold text-slate-900 hover:text-brand-700"
                      >
                        {job.title}
                      </Link>

                      <p className="mt-1 text-sm text-slate-600">
                        {job.company}
                        {job.location ? ` · ${job.location}` : ""}
                      </p>

                      <p className="mt-3 text-sm font-medium text-slate-800">
                        {formatSalaryRange(job.salaryMin, job.salaryMax, job.salaryPeriod)}
                      </p>

                      {conditions.length > 0 && (
                        <p className="mt-1 text-sm text-slate-600">{conditions.join(" · ")}</p>
                      )}

                      {perks.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {perks.map((perk) => (
                            <span
                              key={perk}
                              className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
                            >
                              {perk}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="mt-2 text-xs text-slate-500">
                        Posted {timeAgo(job.createdAt)} · {job.viewCount} views
                        {job.deadline
                          ? ` · Apply by ${new Date(job.deadline).toLocaleDateString()}`
                          : ""}
                      </p>
                    </div>

                    <Link href={`/jobs/${job.id}`} className="shrink-0">
                      <Button variant="outline" size="sm">
                        View details
                      </Button>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <Pagination page={jobs.page} totalPages={jobs.totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
