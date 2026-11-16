"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import api, { errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/Feedback";
import { humanize, timeAgo } from "@/lib/utils";

interface Item {
  key: string;
  listingTitle: string;
  listingHref: string;
  personId: number;
  person: string;
  message: string;
  status: string;
  createdAt: string;
  contextType: "JOB" | "HOUSING";
  contextId: number;
}

export default function InboxPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openingKey, setOpeningKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const [jobs, housing] = await Promise.all([api.jobs.mine(), api.housing.mine()]);
      const jobItems = await Promise.all(
        jobs.map(async (job) => {
          const applications = await api.jobs.applicationsFor(job.id);
          return applications.map<Item>((application) => ({
            key: `job-${application.id}`,
            listingTitle: job.title,
            listingHref: `/jobs/${job.id}`,
            personId: application.applicantId,
            person: application.applicantUsername,
            message: application.coverLetter?.trim() || "No cover letter.",
            status: application.status,
            createdAt: application.createdAt,
            contextType: "JOB",
            contextId: job.id,
          }));
        }),
      );
      const housingItems = await Promise.all(
        housing.map(async (listing) => {
          const inquiries = await api.housing.inquiriesFor(listing.id);
          return inquiries.map<Item>((inquiry) => ({
            key: `housing-${inquiry.id}`,
            listingTitle: listing.title,
            listingHref: `/housing/${listing.id}`,
            personId: inquiry.inquirerId,
            person: inquiry.inquirerUsername,
            message: inquiry.message,
            status: inquiry.status,
            createdAt: inquiry.createdAt,
            contextType: "HOUSING",
            contextId: listing.id,
          }));
        }),
      );
      setItems(
        [...jobItems.flat(), ...housingItems.flat()].sort((a, b) =>
          b.createdAt.localeCompare(a.createdAt),
        ),
      );
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;
    void load();
  }, [authLoading, load]);

  async function openChat(item: Item) {
    setOpeningKey(item.key);
    setError("");
    try {
      const conversation = await api.chat.start({
        recipientId: item.personId,
        contextType: item.contextType,
        contextId: item.contextId,
      });
      router.push(`/chat/${conversation.id}`);
    } catch (err) {
      setError(errorMessage(err));
      setOpeningKey(null);
    }
  }

  if (authLoading || (loading && isAuthenticated)) {
    return <LoadingState message="Loading your inbox..." />;
  }

  if (!isAuthenticated) {
    return (
      <EmptyState
        title="Sign in required"
        description="Sign in to see applications and housing inquiries sent to your posts."
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
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Inbox</h1>
        <p className="mt-1 text-sm text-slate-600">
          Job applications and housing inquiries sent to posts you created. Chat replies to the
          person directly.
        </p>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}

      {items.length === 0 ? (
        <EmptyState
          title="No messages yet"
          description="When someone applies to your job or sends a housing inquiry, it shows up here."
        />
      ) : (
        <ul className="card divide-y divide-slate-100 px-5">
          {items.map((item) => (
            <li key={item.key} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-slate-900">{item.person}</p>
                  <Badge tone={item.contextType === "JOB" ? "brand" : "purple"}>
                    {item.contextType === "JOB" ? "Job application" : "Housing inquiry"}
                  </Badge>
                  <Badge tone={statusTone(item.status)}>{humanize(item.status)}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  On{" "}
                  <Link href={item.listingHref} className="font-medium text-brand-700 hover:underline">
                    {item.listingTitle}
                  </Link>
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{item.message}</p>
                <p className="mt-1 text-xs text-slate-500">{timeAgo(item.createdAt)}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="shrink-0"
                loading={openingKey === item.key}
                onClick={() => void openChat(item)}
              >
                Chat
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
