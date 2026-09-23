"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import api, { errorMessage } from "@/lib/api";
import type { Conversation, PageResponse } from "@/types";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/Feedback";
import { Pagination } from "@/components/ui/Pagination";
import { timeAgo } from "@/lib/utils";

export default function ChatPage() {
  const { isAuthenticated } = useAuth();

  const [conversations, setConversations] = useState<PageResponse<Conversation> | null>(null);
  const [page, setPage] = useState(0);
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
      setConversations(await api.chat.conversations({ page, size: 20 }));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, page]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!isAuthenticated) {
    return (
      <EmptyState
        title="Sign in to use chat"
        description="Real-time messaging is available to registered members."
        action={
          <Link href="/login">
            <Button>Sign in</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
        <p className="mt-1 text-sm text-slate-600">
          Chat directly with job posters, landlords and other members.
        </p>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}

      {loading ? (
        <LoadingState message="Loading conversations..." />
      ) : !conversations || conversations.content.length === 0 ? (
        <EmptyState
          title="No conversations yet"
          description="Start a chat from a job or housing listing, or from a community profile."
          action={
            <div className="flex gap-2">
              <Link href="/jobs">
                <Button variant="outline">Browse jobs</Button>
              </Link>
              <Link href="/housing">
                <Button variant="outline">Browse housing</Button>
              </Link>
            </div>
          }
        />
      ) : (
        <>
          <div className="space-y-2">
            {conversations.content.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/chat/${conversation.id}`}
                className="card flex items-center gap-4 p-4 transition-shadow hover:shadow-md"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-100 font-semibold text-brand-700">
                  {(conversation.otherParticipantFullName ||
                    conversation.otherParticipantUsername)
                    .charAt(0)
                    .toUpperCase()}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-medium text-slate-900">
                      {conversation.otherParticipantFullName ||
                        conversation.otherParticipantUsername}
                    </p>
                    <span className="shrink-0 text-xs text-slate-500">
                      {timeAgo(conversation.lastMessageAt)}
                    </span>
                  </div>

                  <p className="mt-0.5 truncate text-sm text-slate-600">
                    {conversation.lastMessagePreview || "No messages yet"}
                  </p>

                  {conversation.contextType && (
                    <Badge tone="slate" className="mt-1.5">
                      About a {conversation.contextType.toLowerCase()}
                    </Badge>
                  )}
                </div>

                {conversation.unreadCount > 0 && (
                  <span className="grid h-6 min-w-6 shrink-0 place-items-center rounded-full bg-brand-600 px-2 text-xs font-semibold text-white">
                    {conversation.unreadCount}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <Pagination
            page={conversations.page}
            totalPages={conversations.totalPages}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}
