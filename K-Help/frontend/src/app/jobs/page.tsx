"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import api, { errorMessage } from "@/lib/api";
import type { JobListing, JobSortOption, PageResponse } from "@/types";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/i18n/locale-context";
import { MyPosts } from "@/components/ui/MyPosts";
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
  formatWorkDays,
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
import {
  labelExperience,
  labelJobCategory,
  labelJobType,
  labelShift,
  labelSort,
  labelWorkPeriod,
} from "@/lib/i18n/labels";

const SHORT_TERM = ["ONE_DAY", "UNDER_1_MONTH"] as const;

function sameSet(a: string[], b: readonly string[]): boolean {
  return a.length === b.length && b.every((item) => a.includes(item));
}

export default function JobsPage() {
  const { isAuthenticated } = useAuth();
  const { t } = useLocale();

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

  // Deep links such as /jobs?category=CAFE preselect a job category.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("category");
    const match = CATEGORY_OPTIONS.find((option) => option.value === requested);
    if (match) {
      const next = { ...EMPTY_FILTERS, categories: [match.value] };
      setFilters(next);
      setApplied(next);
    }
  }, []);

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
  const chips = activeFilterChips(applied, {
    category: (value) => labelJobCategory(t, value),
    jobType: (value) => labelJobType(t, value),
    noKorean: t("jobs.noKorean"),
    koreanRequired: t("jobs.koreanRequired"),
    visa: t("jobs.visa"),
    meals: t("jobs.meals"),
    housing: t("jobs.housing"),
    insurance: t("jobs.insurance"),
    transport: t("jobs.transport"),
    hiringNow: t("jobs.hiringNow"),
  });
  const invalidRange = salaryRangeInvalid(filters);
  const payNeedsPeriod =
    (applied.sort === "PAY_HIGH" || applied.sort === "PAY_LOW") && applied.salaryPeriod === "";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("page.jobs.title")}</h1>
          <p className="mt-1 text-sm text-slate-600">{t("page.jobs.desc")}</p>
        </div>
        {isAuthenticated && (
          <Link href="/jobs/new">
            <Button>{t("page.postJob")}</Button>
          </Link>
        )}
      </div>

      <MyPosts kind="jobs" />

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
          aria-label={t("jobs.categories")}
        >
          <Chip selected={filters.categories.length === 0} onClick={() => patch({ categories: [] })}>
            {t("jobs.allJobs")}
          </Chip>
          {CATEGORY_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              selected={filters.categories.includes(option.value)}
              onClick={() => patch({ categories: toggleItem(filters.categories, option.value) })}
            >
              {labelJobCategory(t, option.value)}
            </Chip>
          ))}
        </div>

        {/* Quick filters */}
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t("jobs.quickFilters")}>
          <Chip selected={filters.urgent} onClick={() => patch({ urgent: !filters.urgent })}>
            {t("jobs.hiringNow")}
          </Chip>
          <Chip
            selected={filters.koreanRequired === "false"}
            onClick={() => patch({ koreanRequired: filters.koreanRequired === "false" ? "" : "false" })}
          >
            {t("jobs.noKorean")}
          </Chip>
          <Chip
            selected={filters.experienceLevel === "NO_EXPERIENCE"}
            onClick={() =>
              patch({ experienceLevel: filters.experienceLevel === "NO_EXPERIENCE" ? "" : "NO_EXPERIENCE" })
            }
          >
            {t("jobs.beginner")}
          </Chip>
          <Chip
            selected={sameSet(filters.availableDays, WEEKEND)}
            onClick={() =>
              patch({ availableDays: sameSet(filters.availableDays, WEEKEND) ? [] : [...WEEKEND] })
            }
          >
            {t("jobs.weekend")}
          </Chip>
          <Chip
            selected={sameSet(filters.workPeriods, SHORT_TERM)}
            onClick={() =>
              patch({ workPeriods: sameSet(filters.workPeriods, SHORT_TERM) ? [] : [...SHORT_TERM] })
            }
          >
            {t("jobs.shortTerm")}
          </Chip>
          <Chip
            selected={filters.mealsProvided}
            onClick={() => patch({ mealsProvided: !filters.mealsProvided })}
          >
            {t("jobs.meals")}
          </Chip>
          <Chip
            selected={filters.housingProvided}
            onClick={() => patch({ housingProvided: !filters.housingProvided })}
          >
            {t("jobs.housing")}
          </Chip>
          <Chip
            selected={filters.visaSponsorship}
            onClick={() => patch({ visaSponsorship: !filters.visaSponsorship })}
          >
            {t("jobs.visa")}
          </Chip>

          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            aria-expanded={showPanel}
            onClick={() => setShowPanel((open) => !open)}
          >
            {showPanel ? t("ui.hideFilters") : t("ui.allFilters")}
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
                {t("ui.clearFilters")}
              </Button>
              <Button onClick={() => commit(filters)} disabled={invalidRange}>
                {t("jobs.applyFilters")}
              </Button>
            </div>
          </>
        )}

        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t("jobs.active")}
            </span>
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 hover:bg-brand-100"
                onClick={() => commit(chip.remove(applied))}
                aria-label={`${chip.label}`}
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
              {t("jobs.clearAll")}
            </button>
          </div>
        )}
      </div>

      {error && <ErrorState message={error} onRetry={load} />}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600" aria-live="polite">
          {loading || !jobs
            ? t("jobs.searching")
            : `${jobs.totalElements} ${jobs.totalElements === 1 ? t("jobs.jobFound") : t("jobs.jobsFound")}`}
        </p>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          {t("jobs.sortBy")}
          <select
            className="input w-auto py-1.5"
            value={filters.sort}
            onChange={(event) => patch({ sort: event.target.value as JobSortOption })}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {labelSort(t, option.value)}
              </option>
            ))}
          </select>
        </label>
      </div>
      {payNeedsPeriod && (
        <p className="-mt-3 text-xs text-amber-700">{t("jobs.paySortHint")}</p>
      )}

      {loading ? (
        <LoadingState message={t("ui.loadingJobs")} />
      ) : !jobs || jobs.content.length === 0 ? (
        <EmptyState
          title={t("ui.noJobs")}
          description={t("ui.noJobsHint")}
          action={
            hasAnyFilter(applied) ? (
              <Button variant="outline" onClick={clearAll}>
                {t("ui.clearFilters")}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="space-y-3">
            {jobs.content.map((job) => {
              const perks = [
                job.mealsProvided && t("jobs.mealsShort"),
                job.housingProvided && t("jobs.housing"),
                job.insuranceProvided && t("jobs.insurance"),
                job.transportProvided && t("jobs.transport"),
              ].filter(Boolean) as string[];

              const conditions = [
                labelShift(t, job.shift),
                job.hoursPerWeek ? `${job.hoursPerWeek} ${t("jobs.hrsWeek")}` : "",
                formatWorkDays(job.workDays),
                labelWorkPeriod(t, job.workPeriod),
                labelExperience(t, job.experienceLevel),
              ].filter(Boolean);

              return (
                <article key={job.id} className="card card-hover p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap gap-2">
                        {job.urgent && <Badge tone="red">{t("jobs.hiringNow")}</Badge>}
                        {job.category && (
                          <Badge tone="slate">{labelJobCategory(t, job.category)}</Badge>
                        )}
                        <Badge tone="brand">{labelJobType(t, job.jobType)}</Badge>
                        {job.visaSponsorship && <Badge tone="green">{t("jobs.visa")}</Badge>}
                        {!job.koreanRequired && <Badge tone="purple">{t("jobs.noKorean")}</Badge>}
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
                        {t("detail.postedBy")} {job.postedByUsername} · {timeAgo(job.createdAt)} ·{" "}
                        {job.viewCount} {t("ui.views")}
                        {job.deadline
                          ? ` · ${t("jobs.applyBy")} ${new Date(job.deadline).toLocaleDateString()}`
                          : ""}
                      </p>
                    </div>

                    <Link href={`/jobs/${job.id}`} className="shrink-0">
                      <Button variant="outline" size="sm">
                        {t("jobs.viewDetails")}
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
