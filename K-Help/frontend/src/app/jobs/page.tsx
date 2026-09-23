"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import api, { errorMessage } from "@/lib/api";
import type { JobListing, JobType, PageResponse } from "@/types";
import { useAuth } from "@/lib/auth-context";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/Feedback";
import { Pagination } from "@/components/ui/Pagination";
import { formatSalaryRange, humanize, timeAgo } from "@/lib/utils";

const JOB_TYPES: JobType[] = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "TEMPORARY",
  "FREELANCE",
];

export default function JobsPage() {
  const { isAuthenticated } = useAuth();

  const [jobs, setJobs] = useState<PageResponse<JobListing> | null>(null);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({
    q: "",
    jobType: "",
    location: "",
    visaSponsorship: false,
    koreanRequired: false,
  });
  const [applied, setApplied] = useState(filters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          visaSponsorship: applied.visaSponsorship || undefined,
          koreanRequired: applied.koreanRequired || undefined,
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Job Listings</h1>
          <p className="mt-1 text-sm text-slate-600">
            Foreigner-friendly opportunities, filtered by visa sponsorship and language needs.
          </p>
        </div>
        {isAuthenticated && (
          <Link href="/jobs/new">
            <Button>Post a job</Button>
          </Link>
        )}
      </div>

      <div className="card space-y-4 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Keyword"
            value={filters.q}
            onChange={(event) => setFilters({ ...filters, q: event.target.value })}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setPage(0);
                setApplied(filters);
              }
            }}
            placeholder="Title, company, description"
          />
          <Select
            label="Job type"
            value={filters.jobType}
            onChange={(event) => setFilters({ ...filters, jobType: event.target.value })}
          >
            <option value="">Any type</option>
            {JOB_TYPES.map((value) => (
              <option key={value} value={value}>
                {humanize(value)}
              </option>
            ))}
          </Select>
          <Input
            label="Location"
            value={filters.location}
            onChange={(event) => setFilters({ ...filters, location: event.target.value })}
            placeholder="Seoul, Busan..."
          />
          <div className="flex items-end">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setPage(0);
                setApplied(filters);
              }}
            >
              Apply filters
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-5 text-sm text-slate-700">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300"
              checked={filters.visaSponsorship}
              onChange={(event) => {
                const next = { ...filters, visaSponsorship: event.target.checked };
                setFilters(next);
                setPage(0);
                setApplied(next);
              }}
            />
            Visa sponsorship available
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300"
              checked={filters.koreanRequired}
              onChange={(event) => {
                const next = { ...filters, koreanRequired: event.target.checked };
                setFilters(next);
                setPage(0);
                setApplied(next);
              }}
            />
            Korean language required
          </label>
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
          <div className="space-y-3">
            {jobs.content.map((job) => (
              <article key={job.id} className="card p-5">
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
                      {formatSalaryRange(job.salaryMin, job.salaryMax)}
                      {job.salaryCurrency ? ` ${job.salaryCurrency}` : ""}
                    </p>

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
