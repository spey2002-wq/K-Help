"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import api, { errorMessage } from "@/lib/api";
import type { HousingInquiry, JobApplication } from "@/types";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/Feedback";
import { humanize, timeAgo } from "@/lib/utils";

type Kind = "job" | "housing";

interface Row {
  id: number;
  personId: number;
  person: string;
  message: string;
  extra?: string;
  status: string;
  createdAt: string;
}

/** Applications or housing inquiries sent to a listing the current member owns. */
export function OwnerInbox({ kind, listingId }: { kind: Kind; listingId: number }) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");
  const [openingId, setOpeningId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setError("");
    try {
      if (kind === "job") {
        const applications = await api.jobs.applicationsFor(listingId);
        setRows(applications.map(jobRow));
      } else {
        const inquiries = await api.housing.inquiriesFor(listingId);
        setRows(inquiries.map(housingRow));
      }
    } catch (err) {
      setError(errorMessage(err));
      setRows([]);
    }
  }, [kind, listingId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function openChat(row: Row) {
    setOpeningId(row.id);
    setError("");
    try {
      const conversation = await api.chat.start({
        recipientId: row.personId,
        contextType: kind === "job" ? "JOB" : "HOUSING",
        contextId: listingId,
      });
      router.push(`/chat/${conversation.id}`);
    } catch (err) {
      setError(errorMessage(err));
      setOpeningId(null);
    }
  }

  const title = kind === "job" ? "Applications for this job" : "Inquiries for this listing";

  return (
    <section className="card space-y-3 p-6" aria-label={title}>
      <div>
        <h2 className="font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">
          Only you can see these. Open a chat to reply to the person who wrote to you.
        </p>
      </div>
      {error && <ErrorState message={error} onRetry={load} />}
      {rows === null ? (
        <p className="text-sm text-slate-500">Loading messages...</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-slate-500">
          {kind === "job"
            ? "No one has applied yet."
            : "No one has sent an inquiry yet."}
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {rows.map((row) => (
            <li key={row.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-slate-900">{row.person}</p>
                  <Badge tone={statusTone(row.status)}>{humanize(row.status)}</Badge>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{row.message}</p>
                {row.extra && <p className="mt-1 text-xs text-slate-500">{row.extra}</p>}
                <p className="mt-1 text-xs text-slate-500">{timeAgo(row.createdAt)}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="shrink-0"
                loading={openingId === row.id}
                onClick={() => void openChat(row)}
              >
                Chat
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function jobRow(application: JobApplication): Row {
  const extra = [application.resumeUrl && `Resume: ${application.resumeUrl}`, application.employerNote]
    .filter(Boolean)
    .join(" · ");
  return {
    id: application.id,
    personId: application.applicantId,
    person: application.applicantUsername,
    message: application.coverLetter?.trim() || "No cover letter.",
    extra: extra || undefined,
    status: application.status,
    createdAt: application.createdAt,
  };
}

function housingRow(inquiry: HousingInquiry): Row {
  const extra = [
    inquiry.contactPhone && `Phone: ${inquiry.contactPhone}`,
    inquiry.preferredMoveInDate && `Move-in: ${inquiry.preferredMoveInDate}`,
    inquiry.ownerReply && `Your reply: ${inquiry.ownerReply}`,
  ]
    .filter(Boolean)
    .join(" · ");
  return {
    id: inquiry.id,
    personId: inquiry.inquirerId,
    person: inquiry.inquirerUsername,
    message: inquiry.message,
    extra: extra || undefined,
    status: inquiry.status,
    createdAt: inquiry.createdAt,
  };
}
