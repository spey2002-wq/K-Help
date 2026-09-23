"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import api, { errorMessage } from "@/lib/api";
import type { DashboardStats, JobListing, HousingListing, Report, User } from "@/types";
import { useAuth } from "@/lib/auth-context";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/Feedback";
import { humanize, timeAgo } from "@/lib/utils";

type Tab = "overview" | "users" | "jobs" | "housing" | "reports";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "users", label: "Users" },
  { id: "jobs", label: "Job approvals" },
  { id: "housing", label: "Housing approvals" },
  { id: "reports", label: "Reports" },
];

export default function AdminPage() {
  const { isAdmin, loading: authLoading } = useAuth();

  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [housing, setHousing] = useState<HousingListing[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (tab === "overview") {
        setStats(await api.admin.stats());
      } else if (tab === "users") {
        const page = await api.admin.users({ q: search || undefined, size: 50 });
        setUsers(page.content);
      } else if (tab === "jobs") {
        const page = await api.admin.pendingJobs({ size: 50 });
        setJobs(page.content);
      } else if (tab === "housing") {
        const page = await api.admin.pendingHousing({ size: 50 });
        setHousing(page.content);
      } else {
        const page = await api.admin.reports({ size: 50 });
        setReports(page.content);
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [isAdmin, tab, search]);

  useEffect(() => {
    void load();
  }, [load]);

  async function moderateUser(id: number, body: { suspended?: boolean; role?: string }) {
    try {
      await api.admin.moderateUser(id, body);
      setNotice("User updated.");
      await load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function reviewJob(id: number, approved: boolean) {
    try {
      await api.admin.approveJob(id, { approved });
      setNotice(`Job listing ${approved ? "approved" : "rejected"}.`);
      await load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function reviewHousing(id: number, approved: boolean) {
    try {
      await api.admin.approveHousing(id, { approved });
      setNotice(`Housing listing ${approved ? "approved" : "rejected"}.`);
      await load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function resolveReport(id: number, status: string) {
    try {
      await api.admin.resolveReport(id, { status });
      setNotice("Report updated.");
      await load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  if (authLoading) return <LoadingState />;

  if (!isAdmin) {
    return (
      <EmptyState
        title="Administrator access required"
        description="This dashboard is only available to accounts with the ADMIN role."
        action={
          <Link href="/login">
            <Button>Sign in as admin</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Moderate members, approve listings and process reports.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              tab === item.id
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error && <ErrorState message={error} onRetry={load} />}
      {notice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {notice}
        </div>
      )}

      {loading ? (
        <LoadingState />
      ) : (
        <>
          {tab === "overview" && stats && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard label="Total users" value={stats.totalUsers} />
              <StatCard label="Suspended users" value={stats.suspendedUsers} tone="red" />
              <StatCard label="Community posts" value={stats.totalPosts} />
              <StatCard label="Published guides" value={stats.publishedGuides} />
              <StatCard
                label="Jobs awaiting approval"
                value={stats.pendingJobs}
                tone={stats.pendingJobs > 0 ? "amber" : undefined}
              />
              <StatCard label="Approved jobs" value={stats.approvedJobs} />
              <StatCard
                label="Housing awaiting approval"
                value={stats.pendingHousing}
                tone={stats.pendingHousing > 0 ? "amber" : undefined}
              />
              <StatCard label="Available housing" value={stats.availableHousing} />
              <StatCard
                label="Pending reports"
                value={stats.pendingReports}
                tone={stats.pendingReports > 0 ? "red" : undefined}
              />
            </div>
          )}

          {tab === "users" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  className="max-w-sm"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") void load();
                  }}
                  placeholder="Search username, email or name"
                />
                <Button variant="outline" onClick={() => void load()}>
                  Search
                </Button>
              </div>

              <div className="card divide-y divide-slate-100">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-wrap items-center justify-between gap-3 p-4"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {user.fullName || user.username}
                      </p>
                      <p className="text-sm text-slate-600">
                        {user.username} · {user.email}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Joined {timeAgo(user.createdAt)}
                        {user.nationality ? ` · ${user.nationality}` : ""}
                        {user.visaType ? ` · ${user.visaType}` : ""}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={user.role === "ADMIN" ? "purple" : "slate"}>
                        {user.role}
                      </Badge>
                      {user.suspended && <Badge tone="red">Suspended</Badge>}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moderateUser(user.id, { suspended: !user.suspended })}
                      >
                        {user.suspended ? "Reinstate" : "Suspend"}
                      </Button>

                      {user.role !== "ADMIN" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moderateUser(user.id, { role: "MODERATOR" })}
                        >
                          Make moderator
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "jobs" && (
            <div className="space-y-3">
              {jobs.length === 0 ? (
                <EmptyState title="No job listings awaiting approval" />
              ) : (
                jobs.map((job) => (
                  <div key={job.id} className="card p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{job.title}</p>
                        <p className="text-sm text-slate-600">
                          {job.company}
                          {job.location ? ` · ${job.location}` : ""}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Posted by {job.postedByUsername} · {timeAgo(job.createdAt)}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => reviewJob(job.id, true)}>
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => reviewJob(job.id, false)}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "housing" && (
            <div className="space-y-3">
              {housing.length === 0 ? (
                <EmptyState title="No housing listings awaiting approval" />
              ) : (
                housing.map((listing) => (
                  <div key={listing.id} className="card p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{listing.title}</p>
                        <p className="text-sm text-slate-600">
                          {[listing.city, listing.district].filter(Boolean).join(", ")}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Listed by {listing.listedByUsername} · {timeAgo(listing.createdAt)}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => reviewHousing(listing.id, true)}>
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => reviewHousing(listing.id, false)}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "reports" && (
            <div className="space-y-3">
              {reports.length === 0 ? (
                <EmptyState title="No reports submitted" />
              ) : (
                reports.map((report) => (
                  <div key={report.id} className="card p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge tone={statusTone(report.status)}>
                            {humanize(report.status)}
                          </Badge>
                          <Badge tone="slate">
                            {humanize(report.targetType)} #{report.targetId}
                          </Badge>
                        </div>
                        <p className="mt-2 font-medium text-slate-900">{report.reason}</p>
                        {report.details && (
                          <p className="mt-1 text-sm text-slate-600">{report.details}</p>
                        )}
                        <p className="mt-1 text-xs text-slate-500">
                          Reported by {report.reporterUsername} · {timeAgo(report.createdAt)}
                        </p>
                      </div>

                      {report.status === "PENDING" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => resolveReport(report.id, "RESOLVED")}
                          >
                            Resolve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => resolveReport(report.id, "REJECTED")}
                          >
                            Dismiss
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "amber" | "red";
}) {
  const toneClass =
    tone === "amber"
      ? "border-amber-200 bg-amber-50"
      : tone === "red"
        ? "border-red-200 bg-red-50"
        : "border-slate-200 bg-white";

  return (
    <div className={`rounded-xl border p-5 ${toneClass}`}>
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
