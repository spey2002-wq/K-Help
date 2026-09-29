"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type KeyboardEvent } from "react";
import api, { errorMessage } from "@/lib/api";
import type { JobListing, JobType, PageResponse } from "@/types";
import { useAuth } from "@/lib/auth-context";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/Feedback";
import { Pagination } from "@/components/ui/Pagination";
import { formatSalaryRange, humanize, timeAgo } from "@/lib/utils";
import { KOREA_LOCATIONS } from "@/lib/locations";
import {
  EXPERIENCE_OPTIONS,
  MAX_HOURS_OPTIONS,
  POSTED_WITHIN_OPTIONS,
  SALARY_PERIOD_OPTIONS,
  SHIFT_OPTIONS,
  experienceLabel,
  shiftLabel,
} from "@/lib/job-options";

const JOB_TYPES: JobType[] = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "TEMPORARY",
  "FREELANCE",
];

/** Empty string always means "any" for select and number inputs. */
interface JobFilters {
  q: string;
  jobType: string;
  location: string;
  salaryPeriod: string;
  minSalary: string;
  maxSalary: string;
  shift: string;
  maxHoursPerWeek: string;
  experienceLevel: string;
  postedWithinDays: string;
  /** "" = any, "true" = Korean required, "false" = no Korean needed. */
  koreanRequired: "" | "true" | "false";
  visaSponsorship: boolean;
}

const EMPTY_FILTERS: JobFilters = {
  q: "",
  jobType: "",
  location: "",
  salaryPeriod: "",
  minSalary: "",
  maxSalary: "",
  shift: "",
  maxHoursPerWeek: "",
  experienceLevel: "",
  postedWithinDays: "",
  koreanRequired: "",
  visaSponsorship: false,
};

/** Filters that live inside the collapsible "More filters" panel. */
const ADVANCED_KEYS: (keyof JobFilters)[] = [
  "salaryPeriod",
  "minSalary",
  "maxSalary",
  "shift",
  "maxHoursPerWeek",
  "experienceLevel",
  "postedWithinDays",
  "koreanRequired",
  "visaSponsorship",
];

function countAdvanced(filters: JobFilters): number {
  return ADVANCED_KEYS.filter((key) => filters[key] !== EMPTY_FILTERS[key]).length;
}

export default function JobsPage() {
  const { isAuthenticated } = useAuth();

  const [jobs, setJobs] = useState<PageResponse<JobListing> | null>(null);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<JobFilters>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<JobFilters>(EMPTY_FILTERS);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const salaryRangeInvalid =
    filters.minSalary !== "" &&
    filters.maxSalary !== "" &&
    Number(filters.minSalary) > Number(filters.maxSalary);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setJobs(
        await api.jobs.list({
          page,
          size: 10,
          q: applied.q || undefined,
          jobType: applied.jobType || undefined,
          location: applied.location || undefined,
          salaryPeriod: applied.salaryPeriod || undefined,
          minSalary: applied.minSalary ? Number(applied.minSalary) : undefined,
          maxSalary: applied.maxSalary ? Number(applied.maxSalary) : undefined,
          shift: applied.shift || undefined,
          maxHoursPerWeek: applied.maxHoursPerWeek ? Number(applied.maxHoursPerWeek) : undefined,
          experienceLevel: applied.experienceLevel || undefined,
          postedWithinDays: applied.postedWithinDays ? Number(applied.postedWithinDays) : undefined,
          visaSponsorship: applied.visaSponsorship || undefined,
          koreanRequired:
            applied.koreanRequired === "" ? undefined : applied.koreanRequired === "true",
        }),
      );
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, applied]);

  useEffect(() => {
    void load();
  }, [load]);

  function set<K extends keyof JobFilters>(key: K, value: JobFilters[K]) {
    setFilters((previous) => ({ ...previous, [key]: value }));
  }

  function applyFilters() {
    if (salaryRangeInvalid) return;
    setPage(0);
    setApplied(filters);
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
    setPage(0);
  }

  function applyOnEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") applyFilters();
  }

  const activeAdvanced = countAdvanced(applied);
  const hasAnyFilter =
    activeAdvanced > 0 || applied.q !== "" || applied.jobType !== "" || applied.location !== "";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Job Listings</h1>
          <p className="mt-1 text-sm text-slate-600">
            Foreigner-friendly opportunities, filtered by pay, hours, shift and language needs.
          </p>
        </div>
        {isAuthenticated && (
          <Link href="/jobs/new">
            <Button>Post a job</Button>
          </Link>
        )}
      </div>

      <div className="card space-y-4 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Keyword"
            value={filters.q}
            onChange={(event) => set("q", event.target.value)}
            onKeyDown={applyOnEnter}
            placeholder="Title, company, description"
          />
          <Select
            label="Job type"
            value={filters.jobType}
            onChange={(event) => set("jobType", event.target.value)}
          >
            <option value="">Any type</option>
            {JOB_TYPES.map((value) => (
              <option key={value} value={value}>
                {humanize(value)}
              </option>
            ))}
          </Select>
          <Select
            label="Location"
            value={filters.location}
            onChange={(event) => set("location", event.target.value)}
          >
            <option value="">All of South Korea</option>
            {KOREA_LOCATIONS.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>
        </div>

        {showMore && (
          <div className="space-y-4 border-t border-slate-100 pt-4">
            <div>
              <p className="label">Salary range</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <Select
                  aria-label="Salary period"
                  value={filters.salaryPeriod}
                  onChange={(event) => set("salaryPeriod", event.target.value)}
                >
                  <option value="">Any pay type</option>
                  {SALARY_PERIOD_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <Input
                  aria-label="Minimum salary in won"
                  type="number"
                  min={0}
                  step={1000}
                  inputMode="numeric"
                  value={filters.minSalary}
                  onChange={(event) => set("minSalary", event.target.value)}
                  onKeyDown={applyOnEnter}
                  placeholder="Min ₩ (e.g. 10000)"
                />
                <Input
                  aria-label="Maximum salary in won"
                  type="number"
                  min={0}
                  step={1000}
                  inputMode="numeric"
                  value={filters.maxSalary}
                  onChange={(event) => set("maxSalary", event.target.value)}
                  onKeyDown={applyOnEnter}
                  placeholder="Max ₩ (e.g. 15000)"
                  error={salaryRangeInvalid ? "Minimum is higher than maximum" : undefined}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Choose Per hour or Per month first, so hourly wages and monthly salaries aren&apos;t
                compared with each other.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Select
                label="Shift"
                value={filters.shift}
                onChange={(event) => set("shift", event.target.value)}
              >
                <option value="">Any shift</option>
                {SHIFT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Select
                label="Working hours"
                value={filters.maxHoursPerWeek}
                onChange={(event) => set("maxHoursPerWeek", event.target.value)}
              >
                <option value="">Any hours</option>
                {MAX_HOURS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Select
                label="Experience"
                value={filters.experienceLevel}
                onChange={(event) => set("experienceLevel", event.target.value)}
              >
                <option value="">Any experience</option>
                {EXPERIENCE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Select
                label="Posted"
                value={filters.postedWithinDays}
                onChange={(event) => set("postedWithinDays", event.target.value)}
              >
                <option value="">Any time</option>
                {POSTED_WITHIN_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex flex-wrap items-end gap-4">
              <Select
                label="Korean language"
                className="w-full sm:w-56"
                value={filters.koreanRequired}
                onChange={(event) =>
                  set("koreanRequired", event.target.value as JobFilters["koreanRequired"])
                }
              >
                <option value="">Any</option>
                <option value="false">No Korean needed</option>
                <option value="true">Korean required</option>
              </Select>

              <label className="flex items-center gap-2 pb-2.5 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300"
                  checked={filters.visaSponsorship}
                  onChange={(event) => set("visaSponsorship", event.target.checked)}
                />
                Visa sponsorship available
              </label>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            aria-expanded={showMore}
            onClick={() => setShowMore((open) => !open)}
          >
            {showMore ? "Fewer filters" : "More filters"}
            {activeAdvanced > 0 && (
              <span className="badge bg-brand-100 text-brand-700">{activeAdvanced}</span>
            )}
          </Button>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={clearFilters} disabled={!hasAnyFilter && !showMore}>
              Clear filters
            </Button>
            <Button variant="outline" onClick={applyFilters} disabled={salaryRangeInvalid}>
              Apply filters
            </Button>
          </div>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}

      {loading ? (
        <LoadingState message="Loading jobs..." />
      ) : !jobs || jobs.content.length === 0 ? (
        <EmptyState
          title="No jobs match your filters"
          description="Try broadening your search or clearing filters."
        />
      ) : (
        <>
          <p className="text-sm text-slate-600">
            {jobs.totalElements} {jobs.totalElements === 1 ? "job" : "jobs"} found
          </p>

          <div className="space-y-3">
            {jobs.content.map((job) => (
              <article key={job.id} className="card card-hover p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap gap-2">
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

                    {(job.shift || job.hoursPerWeek || job.experienceLevel) && (
                      <p className="mt-1 text-sm text-slate-600">
                        {[
                          shiftLabel(job.shift),
                          job.hoursPerWeek ? `${job.hoursPerWeek} hrs/week` : "",
                          experienceLabel(job.experienceLevel),
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-slate-500">
                      Posted {timeAgo(job.createdAt)} · {job.viewCount} views
                    </p>
                  </div>

                  <Link href={`/jobs/${job.id}`} className="shrink-0">
                    <Button variant="outline" size="sm">
                      View details
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <Pagination page={jobs.page} totalPages={jobs.totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
