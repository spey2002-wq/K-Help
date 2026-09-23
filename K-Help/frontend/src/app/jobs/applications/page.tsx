"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import api, { errorMessage } from "@/lib/api";
import type { ApplicationStatus, JobApplication } from "@/types";
import { useAuth } from "@/lib/auth-context";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/Feedback";
import { humanize, timeAgo } from "@/lib/utils";

export default function MyApplicationsPage() {
  const { isAuthenticated } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      setApplications(await api.jobs.myApplications());
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!isAuthenticated) {
    return (
      <EmptyState
        title="Sign in required"
        description="Sign in to track your job applications."
        action={
          <Link href="/login">
            <Button>Sign in</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My applications</h1>
          <p className="mt-1 text-sm text-slate-600">
            Track the status of every job you have applied to.
          </p>
        </div>
        <Link href="/jobs" className="text-sm text-brand-600 hover:underline">
          Browse jobs
        </Link>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}

      {loading ? (
        <LoadingState message="Loading applications..." />
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Apply to a job listing and it will show up here."
          action={
            <Link href="/jobs">
              <Button>Find a job</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {applications.map((application) => (
            <article key={application.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/jobs/${application.jobListingId}`}
                    className="font-semibold text-slate-900 hover:text-brand-700"
                  >
                    {application.jobTitle}
                  </Link>
                  <p className="mt-1 text-sm text-slate-600">{application.company}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Applied {timeAgo(application.createdAt)}
                  </p>
                  {application.employerNote && (
                    <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                      Employer note: {application.employerNote}
                    </p>
                  )}
                </div>
                <Badge tone={statusTone(application.status)}>
                  {humanize(application.status as ApplicationStatus)}
                </Badge>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
