"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import api, { errorMessage } from "@/lib/api";
import type { JobListing } from "@/types";
import { useAuth } from "@/lib/auth-context";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { ErrorState, LoadingState } from "@/components/ui/Feedback";
import { formatSalaryRange, humanize, timeAgo } from "@/lib/utils";

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const jobId = Number(params.id);
  const { isAuthenticated } = useAuth();

  const [job, setJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [applyOpen, setApplyOpen] = useState(false);
  const [application, setApplication] = useState({ coverLetter: "", resumeUrl: "" });
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setJob(await api.jobs.get(jobId));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (!Number.isNaN(jobId)) void load();
  }, [load, jobId]);

  async function handleApply() {
    setSubmitting(true);
    setError("");
    try {
      await api.jobs.apply(jobId, {
        coverLetter: application.coverLetter || undefined,
        resumeUrl: application.resumeUrl || undefined,
      });
      setNotice("Your application has been submitted.");
      setApplyOpen(false);
      setApplication({ coverLetter: "", resumeUrl: "" });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingState message="Loading job..." />;
  if (error && !job) return <ErrorState message={error} onRetry={load} />;
  if (!job) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/jobs" className="text-sm text-brand-600 hover:underline">
        ← Back to jobs
      </Link>

      {error && <ErrorState message={error} />}
      {notice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {notice}
        </div>
      )}

      <article className="card p-8">
        <div className="flex flex-wrap gap-2">
          <Badge tone="brand">{humanize(job.jobType)}</Badge>
          {job.visaSponsorship && <Badge tone="green">Visa sponsorship</Badge>}
          {!job.koreanRequired && <Badge tone="purple">No Korean needed</Badge>}
          <Badge tone={statusTone(job.status)}>{humanize(job.status)}</Badge>
        </div>

        <h1 className="mt-4 text-3xl font-bold text-slate-900">{job.title}</h1>
        <p className="mt-2 text-slate-600">
          {job.company}
          {job.location ? ` · ${job.location}` : ""}
        </p>

        <div className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-5 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Salary</p>
            <p className="mt-1 font-semibold text-slate-900">
              {formatSalaryRange(job.salaryMin, job.salaryMax)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Deadline</p>
            <p className="mt-1 font-semibold text-slate-900">
              {job.deadline ? new Date(job.deadline).toLocaleDateString() : "Open until filled"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Posted by</p>
            <p className="mt-1 font-semibold text-slate-900">{job.postedByUsername}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Posted</p>
            <p className="mt-1 font-semibold text-slate-900">{timeAgo(job.createdAt)}</p>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="font-semibold text-slate-900">Description</h2>
          <div className="mt-2 whitespace-pre-wrap leading-relaxed text-slate-700">
            {job.description}
          </div>
        </section>

        {job.requirements && (
          <section className="mt-6">
            <h2 className="font-semibold text-slate-900">Requirements</h2>
            <div className="mt-2 whitespace-pre-wrap leading-relaxed text-slate-700">
              {job.requirements}
            </div>
          </section>
        )}

        <div className="mt-8 border-t border-slate-200 pt-6">
          {isAuthenticated ? (
            job.status === "APPROVED" ? (
              <Button onClick={() => setApplyOpen((open) => !open)}>
                {applyOpen ? "Cancel" : "Apply for this job"}
              </Button>
            ) : (
              <p className="text-sm text-slate-500">
                This listing is not open for applications.
              </p>
            )
          ) : (
            <Link href="/login">
              <Button>Sign in to apply</Button>
            </Link>
          )}
        </div>
      </article>

      {applyOpen && (
        <div className="card space-y-4 p-6">
          <h2 className="font-semibold text-slate-900">Submit your application</h2>
          <Textarea
            label="Cover letter"
            value={application.coverLetter}
            onChange={(event) =>
              setApplication({ ...application, coverLetter: event.target.value })
            }
            placeholder="Tell the employer why you are a good fit..."
          />
          <Input
            label="Resume URL (optional)"
            value={application.resumeUrl}
            onChange={(event) =>
              setApplication({ ...application, resumeUrl: event.target.value })
            }
            placeholder="https://drive.google.com/..."
          />
          <div className="flex justify-end">
            <Button onClick={handleApply} loading={submitting}>
              Submit application
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
